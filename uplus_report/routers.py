#!/usr/bin/env python
# -*-coding: utf-8 -*-
from tornado.web import url

from handlers import base, auth, commReport, constantenu,punish

routers = [
    # 首页
    url(r"/", base.DefaultHandler),
    # 登录
    url(r"/login", auth.LoginHandler),
    # 登出
    url(r"/logout", auth.LogoutHandler),

    #获取举报原因枚举
    url(r"/enum/type", constantenu.TypeEnumHandler),
    #获取举报业务场所
    url(r"/enum/mod", constantenu.ModEnumHandler),
    #获取举报处理类型
    url(r"/enum/punish", constantenu.PunishEnumHandler),

    #获取像册图片列表
    url(r"/comm_report/album_image/list",
        commReport.AlbumImageReportListHandler),


    #获取下一个被举报的消息
    url(r"/comm_report/message/next", commReport.MessageReportNextHandler),

    #处罚关联
    url(r'/punish_enum_relation',
        constantenu.PunishRelationHandler),

    #处罚
    url(r"/punish/", punish.PunishAdapterHandler)
]
