#!/usr/bin/env python
# -*-coding: utf-8 -*-
from tornado.web import url

from handlers import base, auth, report, constantenu, punish, passed, \
    hall, show, user, render, userlog


routers_api1 = [
    # 首页
    url(r"/", base.DefaultHandler),
    # 登录
    url(r"/login", auth.LoginHandler),
    # 登出
    url(r"/api/1/logout", auth.LogoutHandler),

    # 获取页面
    url(r"/api/1/get_template", base.GetTemplateHandler),
    url(r"/api/1/template/(?P<path>.+)", base.GetRawTemplateHandler),

    # 获取举报原因枚举
    url(r"/api/1/enum/type", constantenu.TypeEnumHandler),
    # 获取举报业务场所
    url(r"/api/1/enum/mod", constantenu.ModEnumHandler),
    # 获取举报处理类型
    url(r"/api/1/enum/punish", constantenu.PunishEnumHandler),
    # 入口业务枚举
    url(r"/api/1/enum/entrance_mod", constantenu.EntranceModEnumHandler),
    # 所有枚举
    url(r"/api/1/enum/all", constantenu.ALLEnumHandler),

    # 获取像册图片列表
    url(r"/api/1/report/album_image/list",
        report.AlbumImageReportListHandler),
    #获取下一个被举报的消息
    url(r"/api/1/report/message/next", report.MessageReportNextHandler),
    #获取下一个被举报的视频
    url(r"/api/1/report/video/next", report.VideoReportNextHandler),
    #获取还剩余的未处理的举报数
    url(r"/api/1/report/remain", report.RemainReportCountHandler),
    #获取所有还剩余的未处理的举报数（长连）
    url(r"/api/1/report/remain/all", report.WSRemainReportCountHandler),
    #处理一条消息举报结束
    url(r"/api/1/report/end", report.ReportEndHandler),
    #处理一条消息举报结束
    url(r"/api/1/report/batch_deal", report.ReportBatchDealHandler),
    #获取举报profile
    url(r"/api/1/report/(?P<rid>\d+)/profile", report.ReportProfileHandler),

    #报表
    url(r"/api/1/report/sheet", report.ReportSheetHandler),

    #审核通过
    url(r"/api/1/pass", passed.PassedHandler),
    #处罚
    url(r"/api/1/punish", punish.PunishAdapterHandler, name="punish"),
    #处罚关联
    url(r'/api/1/punish_enum_relation',
        constantenu.PunishRelationHandler),

    #大厅解禁
    url(r'/api/1/hall/open_mouth', hall.OpenMouthHallHandler),

    #秀场解禁
    url(r'/api/1/show/open_mouth', show.OpenMouthShowHandler),
    #秀场解封
    url(r'/api/1/show/un_clock', show.UnlockShowHandler),

    #用户解封
    url(r'/api/1/user/un_clock', user.UnlockUplusUserHandler),

    #高危友加用户
    url(r'/api/1/user/risk', user.HighRiskUplusUserHandler),
    url(r'/api/1/user/risk/list', user.HighRiskUplusUserListHandler),

    #特殊友加用户
    url(r'/api/1/user/special', user.SpecialUplusUserHandler),
    url(r'/api/1/user/special/list', user.SpecialUplusUserListHandler),

    #友加用户被惩罚日志
    url(r'/api/1/user/punish/log', punish.UplusUserPunishList),
    #友加用户Profile:
    url(r'/api/1/user/profile', user.UplusUserProfileHandler),

    #系统用户维护
    url(r'/api/1/user', user.UserHandler),
    #所有系统用户
    url(r'/api/1/user/list', user.UserListHandler),
    #所有用户名
    url(r'/api/1/user/name_id_list', user.UserNameIdListHandler),
    #检查用户名是否存在：
    url(r'/api/1/user/check_name', user.UserNameExistCheckHandler),

    #系统用户日志
    url(r'/api/1/user/log', userlog.UserLogHandler),
    url(r'/api/1/user/log/list', userlog.UserLogListHandler),
]

routers_api2 = [
    #友加用户限制上传
    url(r'/api/2/punish/forbidden/upload', punish.ForbiddenUploadHanlder)
]

append_routers = [
    # 获取模板
    url(r"/(?P<path>\w+)", render.RenderHandler)
]

routers = []
routers += routers_api1
routers += append_routers