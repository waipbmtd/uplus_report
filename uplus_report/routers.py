#!/usr/bin/env python
# -*-coding: utf-8 -*-
from tornado.web import url

from handlers import base, auth, commMsg

routers = [
    # 首页
    url(r"/", base.DefaultHandler),
    # 登录
    url(r"/login", auth.LoginHandler),
    # 登出
    url(r"/logout", auth.LogoutHandler),


    # 获取消息首页
    url(r"/comm_msg/index", commMsg.CommonMsgIndexHandler,
        name="comm_msg_index"),
    url(r"/comm_msg/image/list", commMsg.ImageMsgListHandler),
]
