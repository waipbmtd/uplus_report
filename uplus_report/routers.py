#!/usr/bin/env python
# -*-coding: utf-8 -*-
from tornado.web import url

from handlers import base, auth, commReport, constantenu, punish, passed, \
    hall, show, user


routers = [
    # 首页
    url(r"/", base.DefaultHandler),
    # 登录
    url(r"/login", auth.LoginHandler),
    # 登出
    url(r"/logout", auth.LogoutHandler),

    # 获取页面
    url(r"/get_template", base.GetTemplateHandler),

    # 获取举报原因枚举
    url(r"/enum/type", constantenu.TypeEnumHandler),
    # 获取举报业务场所
    url(r"/enum/mod", constantenu.ModEnumHandler),
    # 获取举报处理类型
    url(r"/enum/punish", constantenu.PunishEnumHandler),
    # 入口业务枚举
    url(r"/enum/entrance_mod", constantenu.EntranceModEnumHandler),
    #所有枚举
    url(r"/enum/all", constantenu.ALLEnumHandler),

    #获取像册图片列表
    url(r"/comm_report/album_image/list",
        commReport.AlbumImageReportListHandler),
    #获取下一个被举报的消息
    url(r"/comm_report/message/next", commReport.MessageReportNextHandler),
    #获取还剩余的未处理的举报数
    url(r"/comm_report/remain", commReport.RemainReportCountHandler),

    #审核通过
    url(r"/pass", passed.PassedHandler),
    #处罚
    url(r"/punish", punish.PunishAdapterHandler),
    #处罚关联
    url(r'/punish_enum_relation',
        constantenu.PunishRelationHandler),

    #大厅解禁
    url(r'/hall/open_mouth', hall.OpenMouthHallHandler),

    #秀场解禁
    url(r'/show/open_mouth', show.OpenMouthShowHandler),
    #秀场解封
    url(r'/show/un_clock', show.UnlockShowHandler),

    #用户解封
    url(r'/user/un_clock', user.UnlockUserHandler)
]
