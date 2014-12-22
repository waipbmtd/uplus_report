#!/usr/bin/python
# coding=utf-8
import json
import logging

import tornado
import tornado.web
from tornado import gen
from tornado.httpclient import HTTPError

from handlers.base import BaseHandler
import config
from models import reportConstant
from utils import WebRequrestUtil, util


API_HOST = config.api.host


class PunishBaseHandler(BaseHandler):
    def __init__(self, *args, **kwargs):
        super(BaseHandler, self).__init__(*args, **kwargs)
        self.args = {}
        self.punish_type = 0

    def parse_argument(self):
        self.args = dict(
            # 大厅，秀场，群, 用户
            module_type=self.get_argument("module_type"),
            # 举报人id
            reporter_id=self.get_argument("reporter"),
            # 被举报人id
            uid=self.get_argument("u_id"),
            # 秀场或者群id
            mid=self.get_argument("module_id", ""),
            # report记录id
            rid=self.get_argument("id"),
            # 违规类型
            reason=self.get_argument("reason"),
            # 惩罚类型
            punish_type=int(self.get_argument("punish_type")),
            # 惩罚时长
            timedelta=self.get_argument("timedelta", -1),

            # 举报入口
            mod=self.get_argument("mod"),
            # 备注
            memo=self.get_argument("memo", ""),
            # 资源url
            url=self.get_argument("url", ""),
            # 资源缩略图
            thumb_url=self.get_argument("thumb_url", ""),
            # 消息ID
            msg_id=self.get_argument("msg_id", ""),
            # 文字：
            content=self.get_argument("content", ""),
            # 拥有者ID
            owner=self.get_argument("owner", ""),
            # uucid
            uucid=self.get_argument("uucid",
                                    "7cfc665c-6f9b-11e4-bf2e-976fc2a28482"),
            # 是profile还是普通mesg
            deal_type=self.get_argument("deal_type", "megs"),
            # 客服id
            csid=self.current_user.id
        )

    @property
    def group_parameter(self):
        return dict(
            uid=self.v("uid"),
            mid=self.v("mid"),
            mod=self.v("mod"),
            reason=self.v("reason"),
            timedelta=self.v("timedelta"),
            rid=self.v("rid"),
            csid=self.v("csid"),
            reporter=self.v("reporter_id"),
            owner=self.v("owner"),
            msgId=self.v("msg_id"),
            url=self.v("url"),
            thumb_url=self.v("thumb_url"),
            uucid=self.v("uucid"),
            memo=self.v("memo").encode('utf8'),
            deal_type=self.v("deal_type")
        )

    @property
    def feature_parameter(self):
        return dict(
            mid=self.v("mid"),
            mod=self.v("mod"),
            reason=self.v("reason"),
            timedelta=self.v("timedelta"),
            rid=self.v("rid"),
            csid=self.v("csid"),
            reporter=self.v("reporter_id"),
            msgId=self.v("msg_id"),
            uid=self.v("uid"),
            url=self.v("url"),
            thumb_url=self.v("thumb_url"),
            uucid=self.v("uucid"),
            memo=self.v("memo").encode('utf8'),
            deal_type=self.v("deal_type")
        )

    @property
    def resource_parameter(self):
        return dict(
            uid=self.v("uid"),
            reason=self.v("reason"),
            mid=self.v("mid"),
            mod=self.v("mod"),
            url=self.v("url"),
            thumb_url=self.v("thumb_url"),
            msgId=self.v("msg_id"),
            timedelta=self.v("timedelta"),
            csid=self.v("csid"),
            rid=self.v("rid"),
            reporter=self.v("reporter_id"),
            uucid=self.v("uucid"),
            memo=self.v("memo").encode('utf8'),
            deal_type=self.v("deal_type")
        )

    def log_record_close(self, **kwargs):
        log_format = "%(mod)s %(punish)s (%(uid)s)"
        content = log_format % dict(
            mod=reportConstant.REPORT_MODULE_TYPES.get(
                int(self.v("module_type"))),
            punish=reportConstant.REPORT_PUNISHES.get(
                int(self.v("punish_type"))),
            uid=str(self.v("uid"))
        )
        if self.v("timedelta"):
            content += str(" %sHOURS" % str(self.v("timedelta")))

        self.record_log(content, memo=self.v("memo"))

    log_record_silence = log_record_close

    def log_record_delete(self, **kwargs):
        log_format = "%(mod)s %(punish)s (%(uid)s)"
        content = log_format % dict(
            mod=reportConstant.REPORT_MODULE_TYPES.get(
                int(self.v("module_type"))),
            punish=reportConstant.REPORT_PUNISHES.get(
                int(reportConstant.REPORT_PUNISH_DELETE_RESOURCE)),
            uid=str(self.v("uid"))
        )
        if self.v("content"):
            content += " " + self.v("content").encode('utf8')
        if self.v("url"):
            content += str(" %s" % str(self.v("url")))
        if self.v("thumb_url"):
            content += str(" %s" % str(self.v("thumb_url")))
        self.record_log(content, memo=self.v("memo"))

    def log_record_group(self, **kwargs):
        log_format = "%(mod)s %(punish)s (%(uid)s)"
        content = log_format % dict(
            mod=reportConstant.REPORT_MODULE_TYPES.get(
                int(self.v("module_type"))),
            punish=reportConstant.REPORT_PUNISHES.get(
                int(self.v("punish_type"))),
            uid=str(self.v("uid"))
        )
        self.record_log(content, memo=self.v("memo"))

    def v(self, key):
        return self.args.get(key)


class PunishAdapterHandler(PunishBaseHandler):
    CLOSE_API = config.api.report_close_api
    SILENCE_API = config.api.report_silence_api
    DELETE_RESOURCE = config.api.report_delete_resource
    DISMISS_GROUP = config.api.report_dismiss_group
    KICK_OUT = config.api.report_kick_out

    @util.exception_handler
    def post(self):
        """
        惩罚统一入口
        :return:
        """
        return self.send_success_json()

    @tornado.web.authenticated
    def on_finish(self):
        self.parse_argument()
        module_type = int(self.v("module_type"))
        self.punish_type = int(self.v("punish_type"))
        assert reportConstant.validate_punishes(module_type, self.punish_type)

        data = {}
        if module_type == reportConstant.REPORT_MODULE_TYPE_HALL:
            data = self._punish_hall()
        elif module_type == reportConstant.REPORT_MODULE_TYPE_SHOW:
            data = self._punish_show()
        elif module_type == reportConstant.REPORT_MODULE_TYPE_GROUP:
            data = self._punish_group()
        elif module_type == reportConstant.REPORT_MODULE_TYPE_USER:
            data = self._punish_user()
        logging.info("punish response is %s" % data)

    def _punish_hall(self):
        # 对大厅用户惩罚
        data = {}
        if self.punish_type == reportConstant.REPORT_PUNISH_DELETE_RESOURCE:
            data = self._delete_resource()
        elif self.punish_type == reportConstant.REPORT_PUNISH_SILENCE:
            data = self._silence()
        return data

    def _punish_show(self):
        # 对秀场本省或则秀场内容处罚
        data = {}
        if self.punish_type == reportConstant.REPORT_PUNISH_DELETE_RESOURCE:
            data = self._delete_resource()
        elif self.punish_type == reportConstant.REPORT_PUNISH_SILENCE:
            data = self._silence()
        elif self.punish_type == reportConstant.REPORT_PUNISH_CLOSE_SHOW:
            data = self._close()
        return data

    def _punish_group(self):
        # 对群或则群成员处罚
        data = {}
        if self.punish_type == reportConstant.REPORT_PUNISH_DELETE_RESOURCE:
            data = self._delete_resource()
        elif self.punish_type == reportConstant.REPORT_PUNISH_DISMISS_GROUP:
            data = self._dismiss_group()
        elif self.punish_type == reportConstant.REPORT_PUNISH_KICK_OUT_GROUP:
            data = self._kick_out_group()
        return data

    def _punish_user(self):
        # 对用户处罚
        data = {}
        if self.punish_type == reportConstant.REPORT_PUNISH_DELETE_RESOURCE:
            data = self._delete_resource()
        elif self.punish_type == reportConstant.REPORT_PUNISH_LOGIN_LIMIT:
            data = self._close()
            self._close(reportConstant.REPORT_MODULE_TYPE_SHOW)
        return data

    @gen.coroutine
    def _close(self, module_type=""):
        # 封（封秀场或用户）
        if not module_type:
            module_type = self.v("module_type")
        server_api = self.CLOSE_API % dict(mod_type=module_type,
                                           u_id=self.v("uid"))

        reps = yield WebRequrestUtil. \
            asyncPostRequest(API_HOST,
                             server_api,
                             parameters=self.feature_parameter)
        yield gen.Task(self.log_record_close)
        logging.info("punish response is %s" % reps.body)

    @gen.coroutine
    def _silence(self):
        # 禁言
        server_api = self.SILENCE_API % dict(mod_type=self.v("module_type"),
                                             u_id=self.v("uid"))

        reps = yield WebRequrestUtil. \
            asyncPostRequest(API_HOST,
                             server_api,
                             parameters=self.feature_parameter)
        yield gen.Task(self.log_record_silence)
        logging.info("punish response is %s" % reps.body)

    @gen.coroutine
    def _dismiss_group(self):
        # 解散群
        server_api = self.DISMISS_GROUP
        reps = yield WebRequrestUtil. \
            asyncPostRequest(API_HOST,
                             server_api,
                             parameters=self.group_parameter)
        yield gen.Task(self.log_record_group)
        logging.info("punish response is %s" % reps.body)

    @gen.coroutine
    def _kick_out_group(self):
        # 踢出群
        server_api = self.KICK_OUT
        reps = yield WebRequrestUtil. \
            asyncPostRequest(API_HOST,
                             server_api,
                             parameters=self.group_parameter)
        yield gen.Task(self.log_record_group)
        logging.info("punish response is %s" % reps.body)

    @gen.coroutine
    def _delete_resource(self):
        # 删除资源
        server_api = self.DELETE_RESOURCE
        yield WebRequrestUtil.asyncGetRequest(API_HOST,
                                              server_api,
                                              parameters=self.resource_parameter)
        yield gen.Task(self.log_record_delete)
        # logging.info("punish response is %s" % reps.body)


class UplusUserPunishList(BaseHandler):
    PUNISH_LOG_API = config.api.user_punish_log

    @util.exception_handler
    @tornado.web.authenticated
    @gen.coroutine
    def get(self):
        u_id = self.get_argument("u_id", "")
        if not u_id:
            self.send_error_json(info="查询用户ID不能为空！")
            return
        self.u_id = u_id
        current = self.get_argument("current", 1)
        per = self.get_argument("per", self.per_page_num)
        server_api = self.PUNISH_LOG_API
        reps = yield WebRequrestUtil. \
            asyncGetRequest(API_HOST,
                            server_api,
                            parameters=dict(
                                u_id=u_id,
                                current=current,
                                per=per,
                            ))
        if isinstance(reps, HTTPError):
            self.send_error_json(info=reps.message, code=reps.code)
        else:
            data = json.loads(reps.body)
            j_data = data.get("data", {})
            j_data.update(dict(u_id=u_id))
            data.update(dict(data=j_data))
            self.send_success_json(data)

    @gen.coroutine
    def on_finish(self):
        yield gen.Task(self.record_log, content=u"获取用户被惩罚日志 " + self.u_id)


class ForbiddenUploadHandler(BaseHandler):
    """
    限制上传特定资源（文字:0 (暂定)， 图片:1, 语音：2, 视频：3）
    """
    PUNISH_FORBIDDEN_UPLOAD = config.api.punish_forbidden_upload

    def __init__(self, *args, **kwargs):
        super(BaseHandler, self).__init__(*args, **kwargs)
        self.args = {}

    def parse_args(self):
        self.args = dict(
            # 举报记录id
            rid=int(self.get_argument("rid")),
            # 被举报友加用户id
            uid=int(self.get_argument("uid")),
            # 资源类型(文字:0 (暂定)， 图片:1, 语音：2, 视频：3)
            type=int(self.get_argument("type")),
            # 限制持续的时间(-1为永久)
            timedelta=int(self.get_argument("timedelta", -1)),
            # 违规类型
            reason=int(self.get_argument("reason")),
            # 举报者id
            reporter=int(self.get_argument("reporter")),
            # 备注
            memo=self.get_argument("memo", ""),
            # 信息ID
            msgId=self.get_argument("msg_id"),
            # 资源url
            url=self.get_argument("url", ""),
            # 资源缩略图
            thumb_url=self.get_argument("thumb_url", ""),
            # uucid
            uucid=self.get_argument("uucid",
                                    "7cfc665c-6f9b-11e4-bf2e-976fc2a28482"),
            # 是profile还是普通mesg
            deal_type=self.get_argument("deal_type", "msgs"),
            # 举报入口
            mod=self.get_argument("mod"),
            # 秀场或者群id
            mid=self.get_argument("module_id", ""),
            csid=self.current_user.id,
        )

    def v(self, key):
        return self.args.get(key)

    @property
    def feature_parameter(self):
        return dict(
            mid=self.v("mid"),
            mod=self.v("mod"),
            reason=self.v("reason"),
            timedelta=self.v("timedelta"),
            rid=self.v("rid"),
            csid=self.v("csid"),
            reporter=self.v("reporter_id"),
            msgId=self.v("msg_id"),
            uid=self.v("uid"),
            url=self.v("url"),
            thumb_url=self.v("thumb_url"),
            uucid=self.v("uucid"),
            memo=self.v("memo").encode('utf8'),
            type=self.v("type"),
            deal_type=self.v("deal_type")
        )

    def log_record_close(self, **kwargs):
        log_format = u"{reason},限制用户({uid})上传{type}"
        content = log_format.format(
            reason=reportConstant.REPORT_REASONS.get(self.v("reason")),
            uid=self.v("u_id"),
            type=reportConstant.FORBIDDEN_RESOURCE_TYPES_ENUMS.get(
                self.v("type")))
        if self.v("timedelta"):
            content += str(" %sHOURS" % str(self.v("timedelta")))
        if self.v("content"):
            content += "<br/>" + self.v("content").encode('utf8')
        if self.v("url"):
            content += "<br/>" + str(" %s" % str(self.v("url")))
        if self.v("thumb_url"):
            content += str(" %s" % str(self.v("thumb_url")))

        self.record_log(content, memo=self.v("memo"))

    @util.exception_handler
    @tornado.web.authenticated
    def get(self):
        return self.send_success_json()

    @gen.coroutine
    def on_finish(self):
        server_api = self.PUNISH_FORBIDDEN_UPLOAD
        yield WebRequrestUtil. \
            asyncGetRequest(API_HOST,
                            server_api,
                            parameters=self.feature_parameter)
        yield gen.Task(self.log_record_close)


class DeleteResourceHandler(BaseHandler):
    """
    限制上传特定资源（文字:0 (暂定)， 图片:1, 语音：2, 视频：3）
    """
    DELETE_RESOURCE = config.api.report_delete_resource

    def __init__(self, *args, **kwargs):
        super(BaseHandler, self).__init__(*args, **kwargs)
        self.args = {}

    def parse_args(self):
        self.args = dict(
            # 举报记录id
            rid=int(self.get_argument("rid")),
            # 被举报友加用户id
            uid=int(self.get_argument("uid")),
            # 资源类型(文字:0 (暂定)， 图片:1, 语音：2, 视频：3)
            type=int(self.get_argument("type")),
            # 限制持续的时间(-1为永久)
            timedelta=int(self.get_argument("timedelta", -1)),
            # 违规类型
            reason=int(self.get_argument("reason")),
            # 举报者id
            reporter=int(self.get_argument("reporter")),
            # 备注
            memo=self.get_argument("memo", ""),
            # 信息ID
            msgId=self.get_argument("msg_id"),
            # 资源url
            url=self.get_argument("url", ""),
            # 资源缩略图
            thumb_url=self.get_argument("thumb_url", ""),
            # uucid
            uucid=self.get_argument("uucid",
                                    "7cfc665c-6f9b-11e4-bf2e-976fc2a28482"),
            # 是profile还是普通mesg
            deal_type=self.get_argument("deal_type", "msgs"),
            # 举报入口
            mod=self.get_argument("mod"),
            # 秀场或者群id
            mid=self.get_argument("module_id", ""),
            csid=self.current_user.id,
        )

    def v(self, key):
        return self.args.get(key)

    @property
    def resource_parameter(self):
        return dict(
            uid=self.v("uid"),
            reason=self.v("reason"),
            mid=self.v("mid"),
            mod=self.v("mod"),
            url=self.v("url"),
            thumb_url=self.v("thumb_url"),
            msgId=self.v("msg_id"),
            timedelta=self.v("timedelta"),
            csid=self.v("csid"),
            rid=self.v("rid"),
            reporter=self.v("reporter_id"),
            uucid=self.v("uucid"),
            memo=self.v("memo").encode('utf8'),
            deal_type=self.v("deal_type")
        )

    def log_record_delete(self, **kwargs):
        log_format = u"{reason},删除用户({uid}){type}"
        content = log_format.format(
            reason=reportConstant.REPORT_REASONS.get(self.v("reason")),
            uid=self.v("u_id"),
            type=reportConstant.FORBIDDEN_RESOURCE_TYPES_ENUMS.get(
                self.v("type")))
        if self.v("timedelta"):
            content += str(" %sHOURS" % str(self.v("timedelta")))
        if self.v("content"):
            content += "<br/>" + self.v("content").encode('utf8')
        if self.v("url"):
            content += "<br/>" + str(" %s" % str(self.v("url")))
        if self.v("thumb_url"):
            content += str(" %s" % str(self.v("thumb_url")))

        self.record_log(content, memo=self.v("memo"))

    @util.exception_handler
    @tornado.web.authenticated
    def get(self):
        return self.send_success_json()

    @gen.coroutine
    def on_finish(self):
        server_api = self.DELETE_RESOURCE
        reps = yield WebRequrestUtil. \
            asyncPostRequest(API_HOST,
                             server_api,
                             parameters=self.resource_parameter)
        yield gen.Task(self.log_record_delete)