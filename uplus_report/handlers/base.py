#!/usr/bin/env python
# -*- coding: utf-8 -*-
from datetime import datetime
import json
import logging
import time

import jsonpickle
import jsonpickle.backend
import tornado.web

import config
from storage.mysql.database import session_manage
from storage.mysql.models import AdminUser, AdminOperationLog
from utils import util


class BaseHandler(tornado.web.RequestHandler):
    def __init__(self, application, request, **kwargs):
        super(BaseHandler, self).__init__(application, request, **kwargs)
        self.session = None

    def initialize(self):
        pass

    def json(self, data):
        """

        :rtype : object
        """
        backend = jsonpickle.backend.JSONBackend()
        backend.set_encoder_options("json", default=util.dthandler,
                                    ensure_ascii=False)
        self.write(jsonpickle.encode(data, unpicklable=False, backend=backend))

        self.set_header('Content-Type', 'application/json; charset=UTF-8')

    def send_success_json(self, data={}, info="", code=""):
        backend = jsonpickle.backend.JSONBackend()
        backend.set_encoder_options("json", default=util.dthandler,
                                    ensure_ascii=False)
        self.set_header("Content-Type", "application/json; charset=UTF-8")
        result = {'ret': 0, 'code': code, 'info': info}
        result.update(data)
        self.write(jsonpickle.encode(result,
                                     unpicklable=False,
                                     backend=backend))
        self.finish()

    def send_error_json(self, data={}, info="", code=""):
        backend = jsonpickle.backend.JSONBackend()
        backend.set_encoder_options("json", default=util.dthandler,
                                    ensure_ascii=False)
        self.set_header("Content-Type", "application/json; charset=UTF-8")
        result = {'ret': 1, 'code': code, 'info': info}
        result.update(data)
        self.write(jsonpickle.encode(result,
                                     unpicklable=False,
                                     backend=backend))
        self.finish()

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

        expire_time = now + idel
        self.set_secure_cookie("u_a_e", u'{}'.format(expire_time))

        user = self.session.query(AdminUser).filter_by(id=int(user_id),
                                                       state=True).first()
        if not user:
            return None

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