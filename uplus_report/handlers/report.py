#!/usr/bin/python
# coding=utf-8
import json
import logging
import datetime

import tornado
import tornado.web
from tornado import gen

import config
from handlers.base import BaseHandler, BaseWebSocketHandler
from models import reportConstant, redisConstant
from storage.mysql.database import session_manage
from utils import WebRequrestUtil, util
from storage.redis.redisClient import redis_remain_num


API_HOST = config.api.host


class ReportIndexHandler(BaseHandler):
    """
    普通消息首页
    """

    @tornado.web.authenticated
    def get(self):
        return self.render("comm_report/main.html")


class AlbumImageReportListHandler(BaseHandler):
    """
    普通举报相册图片列表
    """
    LIST_ALBUM_IMAGE = config.api.report_album_image_list

    @util.exception_handler
    @tornado.web.authenticated
    @gen.coroutine
    def get(self):
        report_type = self.get_argument("report_type",
                                        reportConstant.REPORT_TYPE_COMM)

        reps = yield WebRequrestUtil.asyncGetRequest(API_HOST,
                                                     self.LIST_ALBUM_IMAGE,
                                                     parameters=dict(
                                                         report_type=report_type,
                                                         csid=self.current_user.id,
                                                         size=15))
        self.asyn_response(reps)

    def on_finish(self):
        report_type = self.get_argument("report_type",
                                        reportConstant.REPORT_TYPE_COMM)
        self.record_log(content=u"获取下一批图片 " +
                                reportConstant.REPORT_TYPE_ENUMS.get(
                                    int(report_type)).decode('utf8'))

    post = get


class MessageReportNextHandler(BaseHandler):
    """
    获取下一个被举报的消息
    """
    NEXT_MESSAGE = config.api.report_message_next

    @util.exception_handler
    @tornado.web.authenticated
    @session_manage
    def get(self):
        report_type = self.get_argument("report_type",
                                        reportConstant.REPORT_TYPE_COMM)
        reps = yield WebRequrestUtil.asyncGetRequest(API_HOST,
                                                     self.NEXT_MESSAGE,
                                                     parameters=dict(
                                                         report_type=report_type,
                                                         csid=self.current_user.id))

        self.asyn_response(reps)
        j_data = json.loads(reps.body)
        ret = int(j_data.get("ret"))
        if ret == 0:
            data = j_data.get("data", {})
            data.update(
                {"profile": data.get("profile", dict(name="",
                                                     desc="",
                                                     oid="",
                                                     mid="")
                )
                })
            j_data.update({"data": data})


    def on_finish(self):
        report_type = self.get_argument("report_type",
                                        reportConstant.REPORT_TYPE_COMM)
        self.record_log(content=u"获取下一条消息 " +
                                reportConstant.REPORT_TYPE_ENUMS.get(
                                    int(report_type)).decode('utf8'))


class RemainReportCountHandler(BaseHandler):
    REMAIN_REPORT = config.api.report_remain_count

    @util.exception_handler
    @tornado.web.authenticated
    def get(self):
        report_type = self.get_argument("report_type",
                                        reportConstant.REPORT_TYPE_COMM)
        reps = yield WebRequrestUtil.asyncGetRequest(API_HOST,
                                                     self.REMAIN_REPORT,
                                                     parameters=dict(
                                                         report_type=report_type,
                                                         csid=self.current_user.id
                                                     ))
        self.asyn_response(reps)


class WSRemainReportCountHandler(BaseWebSocketHandler):
    _redis = redis_remain_num
    KEY = redisConstant.REDIS_REMAIN_NUM

    clients = set()
    REMAIN_REPORT = config.api.report_remain_count

    def open(self):
        WSRemainReportCountHandler.clients.add(self)

    def on_message(self, message):
        logging.info("receive message %s" % message)
        self._build_message()

    def on_close(self):
        WSRemainReportCountHandler.clients.remove(self)
        logging.info("webSocket Close")

    @gen.coroutine
    def _build_message(self):
        data = []
        for report_type in reportConstant.REPORT_TYPE_ENUMS:
            response = yield WebRequrestUtil.asyncGetRequest(API_HOST,
                                                             self.REMAIN_REPORT,
                                                             parameters=dict(
                                                                 report_type=report_type
                                                             ))
            i_j_data = json.loads(response.body)
            ret = i_j_data.get("ret", reportConstant.API_RET_NO)
            if ret == reportConstant.API_RET_NO:
                self.write_message(self.build_error_json(
                    info=i_j_data.get("info", ""),
                    code=i_j_data.get("code", "")))
                return
            else:
                data.append(i_j_data.get("data"))
        r_j_data = dict(data=data)
        self.write_message(self.build_success_json(r_j_data))


class ReportEndHandler(BaseHandler):
    END_REPORT = config.api.report_check_end

    @util.exception_handler
    @tornado.web.authenticated
    def get(self):
        rid = self.get_argument("id")
        report_type = self.get_argument("report_type",
                                        reportConstant.REPORT_TYPE_COMM)
        reps = yield WebRequrestUtil.asyncGetRequest(API_HOST,
                                                     self.END_REPORT,
                                                     parameters=dict(
                                                         report_type=report_type,
                                                         rid=rid,
                                                         csid=self.current_user.id,
                                                     ))
        self.asyn_response(reps)


class ReportBatchDealHandler(BaseHandler):
    BATH_REPORT = config.api.report_batch_deal

    def post(self):
        return self.send_success_json()

    @tornado.web.authenticated
    @gen.coroutine
    def on_finish(self):
        report_type = self.get_argument("report_type",
                                        reportConstant.REPORT_TYPE_COMM)
        items = self.get_argument("items")
        deal = self.get_argument("deal")
        timedelta = self.get_argument("timedelta", -1)
        yield WebRequrestUtil.asyncPostRequest(API_HOST,
                                               self.BATH_REPORT,
                                               parameters=dict(
                                                   items=items.encode('utf8'),
                                                   deal=deal.encode('utf8'),
                                                   report_type=report_type,
                                                   timedelta=timedelta,
                                                   csid=self.current_user.id,
                                               ))
        s_content, s_memo = self._deal_detail()
        s_content2 = self._items_detail()
        self.record_log(content=s_content.decode("utf8") + "<br/>"
                                + s_content2,
                        memo=s_memo)

    def _deal_detail(self):
        l_content = []
        s_memo = ""

        deal = self.get_argument("deal")
        j_deal = json.loads(deal)

        b_pass = int(j_deal.get("pass"))
        s_deal = reportConstant.REPORT_PASS_ENUMS.get(b_pass)

        report_type = self.get_argument("report_type",
                                        reportConstant.REPORT_TYPE_COMM)
        s_report_type = reportConstant.REPORT_TYPE_ENUMS.get(int(report_type))

        l_content.append(s_deal)
        l_content.append(s_report_type)

        if not b_pass:
            s_reason = reportConstant.REPORT_REASONS.get(
                int(j_deal.get("reason", reportConstant.REPORT_REASON_SEX)))
            s_m_type = reportConstant.REPORT_MODULE_TYPES.get(
                int(j_deal.get("module_type",
                               reportConstant.REPORT_MODULE_TYPE_USER)))
            s_p_type = reportConstant.REPORT_PUNISHES.get(
                int(j_deal.get("punish_type",
                               reportConstant.REPORT_PUNISH_DELETE_RESOURCE)))
            s_timedelta = str(j_deal.get("timedelta", ""))
            if s_timedelta == "-1":
                s_timedelta = u"永久".encode('utf8')
            elif s_timedelta != "":
                s_timedelta += u"小时".encode('utf8')
            s_memo = j_deal.get("memo").encode('utf8')

            l_content.append(s_reason)
            l_content.append(s_m_type)
            l_content.append(s_p_type)
            l_content.append(s_timedelta)

        return ",".join(l_content), s_memo

    def _items_detail(self):
        items = self.get_argument("items")
        d_items = json.loads(items)
        return "<br/>".join(
            [x.get("url") + x.get("content", " ") + u"(用户ID:" + x.get(
                "u_id") + ")" for x in d_items])


class ReportSheetHandler(BaseHandler):
    REPORT_SHEET_API = config.api.report_sheet

    @util.exception_handler
    @tornado.web.authenticated
    @gen.coroutine
    def get(self):
        csid = self.get_argument("csid", "")
        if not self.is_admin():
            csid = self.current_user.id

        n_time = datetime.datetime.now()
        start_date = self.get_argument("start_date",
                                       n_time.strftime('%Y-%m-%d'))
        end_date = self.get_argument("end_date", (
            n_time + datetime.timedelta(days=1)).strftime('%Y-%m-%d'))
        reps = yield WebRequrestUtil.asyncGetRequest(API_HOST,
                                                     self.REPORT_SHEET_API,
                                                     parameters=dict(
                                                         csid=csid,
                                                         start_date=start_date,
                                                         end_date=end_date,
                                                     ))
        self.asyn_response(reps)

    def on_finish(self):
        csid = self.get_argument("csid", "")
        if not self.is_admin():
            csid = self.current_user.id

        n_time = datetime.datetime.now()
        start_date = self.get_argument("start_date",
                                       n_time.strftime('%Y-%m-%d'))
        end_date = self.get_argument("end_date", (
            n_time + datetime.timedelta(days=1)).strftime('%Y-%m-%d'))
        self.record_log(u"获取客服(%s)的报表(从%s至%s)" % (csid, start_date, end_date))


class ReportProfileHandler(BaseHandler):
    REPORT_PROFILE_API = config.api.report_profile

    @util.exception_handler
    @tornado.web.authenticated
    @gen.coroutine
    def get(self, rid):
        rid = int(rid)
        reps = yield WebRequrestUtil.asyncGetRequest(API_HOST,
                                                     self.REPORT_PROFILE_API,
                                                     parameters=dict(
                                                         rid=rid,
                                                     ))
        self.asyn_response(reps)

        j_data = json.loads(reps.body)
        j_i_data = j_data.get("data")
        j_i_data.update(dict(desc=j_i_data.get("desc", ""),
                             name=j_i_data.get("name", ""),
                             mid=j_i_data.get("mid", ""),
                             oid=j_i_data.get("oid", "")))
        self.log_message = u"获取举报(%s)的profile" % rid

    def on_finish(self):
        if self.log_message:
            self.record_log(self.log_message)
