#!/usr/bin/python
# coding=utf-8
import tornado
import tornado.web

from handlers.base import BaseHandler
from models import reportConstant


class TypeEnumHandler(BaseHandler):
    """
    举报原因枚举（色情，广告。。。）
    """

    @tornado.web.authenticated
    def get(self):
        enum_dic = reportConstant.REPORT_REASONS
        report_type_list = [dict(id=x, title=enum_dic[x]) for x in enum_dic]
        return self.json(report_type_list)


class ModEnumHandler(BaseHandler):
    """
    业务场所
    """

    @tornado.web.authenticated
    def get(self):
        enum_dic = reportConstant.REPORT_MODULE_TYPES
        report_type_list = [dict(id=x, title=enum_dic[x]) for x in enum_dic]
        return self.json(report_type_list)


class PunishEnumHandler(BaseHandler):
    """
    惩罚类型
    """

    @tornado.web.authenticated
    def get(self):
        enum_dic = reportConstant.REPORT_PUNISHES
        report_type_list = [dict(id=x, title=enum_dic[x]) for x in enum_dic]
        return self.json(report_type_list)


class PunishRelationHandler(BaseHandler):
    """
    像册处罚关联表
    """

    @tornado.web.authenticated
    def get(self):
        enum_dic = reportConstant.PUNISH_RELATION
        return self.send_success_json(dict(data=enum_dic))


class EntranceModEnumHandler(BaseHandler):
    """
    MOD取值
    """

    @tornado.web.authenticated
    def get(self):
        enum_dic = reportConstant.MOD_ENUM
        return self.send_success_json(dict(data=enum_dic))


class ALLEnumHandler(BaseHandler):
    """
    获取所有接口
    """

    @tornado.web.authenticated
    def get(self):
        ent_enum_dic = reportConstant.MOD_ENUM
        reasons = reportConstant.REPORT_REASONS
        request = reportConstant.REQUEST_TYPES
        risk = reportConstant.REPORT_RISK_ENUMS
        msg_types = reportConstant.MESSAGE_TYPES_ENUMS

        return self.json(dict(mod=ent_enum_dic,
                              type=reasons,
                              ret=request,
                              risk=risk,
                              msg_types=msg_types)
                        )