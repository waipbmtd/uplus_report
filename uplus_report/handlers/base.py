#!/usr/bin/env python
# -*- coding: utf-8 -*-
from datetime import datetime
import json
import logging
import time

import jsonpickle
import jsonpickle.backend
import tornado.web
from tornado import websocket

import config
from models import userConstant
from storage.mysql.database import session_manage
from storage.mysql.models import AdminUser, AdminOperationLog
from utils import util


class JsonBaseHandler(object):
    def build_json(self, data):
        """

        :rtype : object
        """
        backend = jsonpickle.backend.JSONBackend()
        backend.set_encoder_options("json", default=util.dthandler,
                                    ensure_ascii=False)
        return jsonpickle.encode(data, unpicklable=False, backend=backend)

    def build_success_json(self, data={}, info="", code=""):
        backend = jsonpickle.backend.JSONBackend()
        backend.set_encoder_options("json", default=util.dthandler,
                                    ensure_ascii=False)
        result = {'ret': 0, 'code': code, 'info': info}
        result.update(data)
        return jsonpickle.encode(result,
                                 unpicklable=False,
                                 backend=backend)

    def build_error_json(self, data={}, info="", code=""):
        backend = jsonpickle.backend.JSONBackend()
        backend.set_encoder_options("json", default=util.dthandler,
                                    ensure_ascii=False)
        result = {'ret': 1, 'code': code, 'info': info}
        result.update(data)
        return jsonpickle.encode(result,
                                 unpicklable=False,
                                 backend=backend)


class BaseHandler(tornado.web.RequestHandler, JsonBaseHandler):
    def __init__(self, application, request, **kwargs):
        super(BaseHandler, self).__init__(application, request, **kwargs)
        super(JsonBaseHandler, self).__init__()
        self.per_page_num = config.app.layout.get("items_per_page")
        self.session = None

    def initialize(self):
        pass

    def json(self, data):
        """

        :rtype : object
        """
        self.set_header('Content-Type', 'application/json; charset=UTF-8')
        self.write(self.build_json(data))

    def send_success_json(self, data={}, info="", code=""):
        self.set_header("Content-Type", "application/json; charset=UTF-8")
        self.write(self.build_success_json(data, info, code))

    def send_error_json(self, data={}, info="", code=""):
        self.set_header("Content-Type", "application/json; charset=UTF-8")
        self.write(self.build_error_json(data, info, code))

    def handle_http_arguments(self, arguments):
        if not isinstance(arguments, dict):
            return
        for key, val in arguments.items():
            try:
                arguments[key] = val[0].strip()
            except:
                arguments[key] = val[0]
        return arguments

    @session_manage
    def get_current_user(self):
        user_id = self.get_secure_cookie("r_u_a")
        expire_time = self.get_secure_cookie("r_u_a_e")

        if not user_id:
            return None

        now = time.time()
        idel = int(config.app.max_idle_time)
        try:
            expire = float(expire_time)
        except Exception:
            return None
        if expire < now:
            return None

        user = self.session.query(AdminUser).get(int(user_id))
        if not user or not user.state:
            return None

        expire_time = now + idel
        self.set_secure_cookie("u_a_e", u'{}'.format(expire_time))

        self.session.expunge(user)
        return user

    def get(self):
        path = self.get_argument("path")

        return self.render('login.html')

    @session_manage
    def record_log(self, content="", memo=""):
        log = AdminOperationLog(content=content,
                                memo=memo,
                                create_time=datetime.now(),
                                ip=self.request.remote_ip)
        if self.current_user:
            current_user = self.session.query(AdminUser).get(
                self.current_user.id)
            current_user.logs.append(log)
        else:
            self.session.add(log)

    def is_admin(self):
        return self.current_user.role == userConstant.USER_ROLE_ADMIN


class BaseWebSocketHandler(websocket.WebSocketHandler, JsonBaseHandler):
    def __init__(self, application, request, **kwargs):
        super(BaseWebSocketHandler, self).__init__(application, request,
                                                   **kwargs)
        super(JsonBaseHandler, self).__init__()

    def json(self, data):
        self.write(self.build_json(data))

    def send_success_json(self, data={}, info="", code=""):
        self.write(self.build_success_json(data, info, code))

    def send_error_json(self, data={}, info="", code=""):
        self.write(self.build_error_json(data, info, code))


class DefaultHandler(BaseHandler):
    @tornado.web.authenticated
    def get(self):
        logging.info(
            "revere index url : %s" % "index.html")
        self.redirect("/report_common")


class GetTemplateHandler(BaseHandler):
    @tornado.web.authenticated
    def get(self):
        page = self.get_argument("page")
        page_str = self.render_string(page)
        self.finish(page_str)