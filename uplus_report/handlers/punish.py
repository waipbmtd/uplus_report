#!/usr/bin/python
# coding=utf-8
import json
import tornado
import tornado.web
from handlers.base import BaseHandler
import config
from models import serverApiConstant, reportConstant
from utils import WebRequrestUtil

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
            #report记录id
            rid=self.get_argument("id"),
            #违规类型
            reason=self.get_argument("reason"),
            #惩罚类型
            punish_type=int(self.get_argument("punish_type")),
            #惩罚时长
            timedelta=self.get_argument("timedelta", -1),

            #举报入口
            mod=self.get_argument("mod"),
            # 备注
            memo=self.get_argument("memo", ""),
            # 资源url
            url=self.get_argument("url", ""),
            #资源缩略图
            thumb_url=self.get_argument("thumb_url", ""),
            #消息ID
            msg_id=self.get_argument("msg_id", ""),
            #拥有者ID
            owner=self.get_argument("owner", ""),
            #客服id
            cid=self.current_user.id
        )

    @property
    def feature_parameter(self):
        return dict(
            mid=self.v("mid"),
            mod=self.v("mod"),
            reason=self.v("reason"),
            timedelta=self.v("timedelta"),
            rid=self.v("rid"),
            cid=self.v("cid"),
            reporter=self.v("report_id")
        )

    @property
    def resource_parameter(self):
        return dict(
            uid=self.v("uid"),
            reason=self.v("reason"),
            mid=self.v("mid"),
            mod=self.v("mod"),
            url=self.v("url"),
            thumbUrl=self.v("thumb_url"),
            msgId=self.v("msg_id"),
            timedelta=self.v("timedelta"),
            cid=self.v("cid"),
            reporter=self.v("report_id")
        )

    def log_record(self):
        log_format = "%(punish) s%(mod)s (%(uid)s)"
        content = log_format % dict(
            mod=reportConstant.REPORT_MODULE_TYPES.get(
                int(self.v("module_type"))),
            punish=reportConstant.REPORT_PUNISHES.get(
                int(self.v("punish_type"))),
            uid=str(self.v("uid"))
        )
        if self.v("timedelta"):
            content += str(" %sHOURS" % self.v("timedelta"))
        if self.v("url"):
            content += " %s" % self.v("url")
        if self.v("thumb_url"):
            content += " %s" % self.v("thumb_url")
        self.record_log(content)

    def v(self, key):
        return self.args.get(key)


class PunishAdapterHandler(PunishBaseHandler):
    CLOSE_API = config.api.report_close_api
    SILENCE_API = config.api.report_silence_api
    DELETE_RESOURCE = config.api.report_delete_resource

    @tornado.web.authenticated
    def post(self):
        """
        惩罚统一入口
        :return:
        """
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

        return self.send_success_json(json.loads(data))

    def _punish_hall(self):
        # 对大厅用户惩罚
        return {}


    def _punish_show(self):
        # 对秀场本省或则秀场内容处罚
        return {}

    def _punish_group(self):
        # 对群或则群成员处罚
        return {}

    def _punish_user(self):
        # 对用户处罚
        data = {}
        if self.punish_type == reportConstant.REPORT_PUNISH_DELETE_RESOURCE:
            data = self._delete_resource()
        elif self.punish_type == reportConstant.REPORT_PUNISH_LOGIN_LIMIT:
            data = self._close(reportConstant.REPORT_MODULE_TYPE_USER,
                               self.v("uid"))
        return data

    def _close(self, mod_type, u_id):
        # 封（封大厅或用户）
        server_api = self.CLOSE_API % dict(mod_type=mod_type, u_id=u_id)

        data = WebRequrestUtil.getRequest2(API_HOST,
                                           server_api,
                                           parameters=self.feature_parameter)

        self.log_record()
        self._delete_resource()
        return data

    def _silence(self, mod_type, u_id):
        # 禁言
        server_api = self.SILENCE_API % dict(mod_type=mod_type, u_id=u_id)

        data = WebRequrestUtil.getRequest2(API_HOST,
                                           server_api,
                                           parameters=self.feature_parameter)

        self.log_record()
        self.delete_resource()
        return data

    def _dismiss_group(self):
        # 解散群
        return {}

    def _kick_out_group(self):
        # 踢出群
        return {}

    def _delete_resource(self):
        # 删除资源
        server_api = self.DELETE_RESOURCE
        data = WebRequrestUtil.getRequest2(API_HOST,
                                           server_api,
                                           parameters=self.resource_parameter)
        self.log_record()
        return data

