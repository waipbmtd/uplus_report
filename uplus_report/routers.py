#!/usr/bin/env python
# -*-coding: utf-8 -*-
from tornado.web import url

from handlers import base, auth, report, constantenu, punish, passed, \
    hall, show, user, render, userlog


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
    # 所有枚举
    url(r"/enum/all", constantenu.ALLEnumHandler),

    #获取像册图片列表
    url(r"/report/album_image/list",
        report.AlbumImageReportListHandler),
    #获取下一个被举报的消息
    url(r"/report/message/next", report.MessageReportNextHandler),
    #获取还剩余的未处理的举报数
    url(r"/report/remain", report.RemainReportCountHandler),
    #处理一条消息举报结束
    url(r"/report/end", report.ReportEndHandler),

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
    url(r'/user/un_clock', user.UnlockUplusUserHandler),

    #所有用户
    url(r'/user/list', user.UserListHandler),

    #高危用户
    url(r'/user/risk', user.HighRiskUserHandler),
    url(r'/user/risk/list', user.HighRiskUserListHandler),

    #特殊用户
    url(r'/user/special', user.SpecialUserHandler),
    url(r'/user/special/list', user.SpecialUserListHandler),

    #用户日志
    url(r'/log', userlog.UserLogHandler),
    url(r'/log/list', userlog.UserLogListHandler),
]

append_routers = [
    # 获取模板
    url(r"/(?P<path>\w+)", render.RenderHandler)
]

routers += append_routers