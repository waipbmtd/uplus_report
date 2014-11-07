#!/usr/bin/env python
# -*-coding: utf-8 -*-
from tornado.web import url

from handlers import base, auth, commMsg, constantenu

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

    # 获取消息首页
    url(r"/comm_msg/index", commMsg.CommonMsgIndexHandler,
        name="comm_msg_index"),
    url(r"/comm_msg/image/list", commMsg.ImageMsgListHandler),
]
