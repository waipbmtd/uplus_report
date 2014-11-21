#!/usr/bin/python
# coding=utf-8
import json
import tornado
import tornado.web
import config
from handlers.base import BaseHandler
from models import reportConstant
from storage.mysql.database import session_manage
from utils import WebRequrestUtil, util

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
    def get(self):
        risk = self.get_argument("risk", reportConstant.REPORT_RISK_FALSE)
        data = WebRequrestUtil.getRequest2(API_HOST,
                                           self.LIST_ALBUM_IMAGE,
                                           parameters=dict(
                                               risk=risk,
                                               csid=self.current_user.id,
                                               size=15))
        self.record_log(content=u"获取下一批图片 " +
                                reportConstant.REPORT_RISK_ENUMS.get(
                                    int(risk)).decode('utf8'))
        return self.send_success_json(json.loads(data))

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
        risk = self.get_argument("risk", reportConstant.REPORT_RISK_FALSE)
        data = WebRequrestUtil.getRequest2(API_HOST,
                                           self.NEXT_MESSAGE,
                                           parameters=dict(
                                               risk=risk,
                                               csid=self.current_user.id))
        self.record_log(content=u"获取下一条消息 " +
                                reportConstant.REPORT_RISK_ENUMS.get(
                                    int(risk)).decode('utf8'))
        return self.send_success_json(json.loads(data))


class RemainReportCountHandler(BaseHandler):
    REMAIN_REPORT = config.api.report_remain_count

    @util.exception_handler
    @tornado.web.authenticated
    def get(self):
        risk = self.get_argument("risk", reportConstant.REPORT_RISK_FALSE)
        data = WebRequrestUtil.getRequest2(API_HOST,
                                           self.REMAIN_REPORT,
                                           parameters=dict(
                                               risk=risk,
                                               csid=self.current_user.id
                                           ))
        return self.send_success_json(json.loads(data))


class ReportEndHandler(BaseHandler):
    END_REPORT = config.api.report_check_end

    @util.exception_handler
    @tornado.web.authenticated
    def get(self):
        rid = self.get_argument("id")
        risk = self.get_argument("risk", reportConstant.REPORT_RISK_FALSE)
        data = WebRequrestUtil.getRequest2(API_HOST,
                                           self.END_REPORT,
                                           parameters=dict(
                                               risk=risk,
                                               rid=rid,
                                               csid=self.current_user.id,
                                           ))
        return self.send_success_json(json.loads(data))


class ReportBatchDealHandler(BaseHandler):
    BATH_REPORT = config.api.report_batch_deal

    @util.exception_handler
    @tornado.web.authenticated
    def post(self):
        return self.send_success_json()

    def on_finish(self):
        risk = self.get_argument("risk", reportConstant.REPORT_RISK_FALSE)
        items = self.get_argument("items")
        deal = self.get_argument("deal")
        data = WebRequrestUtil.getRequest2(API_HOST,
                                           self.BATH_REPORT,
                                           parameters=dict(
                                               items=items,
                                               deal=deal,
                                               csid=self.current_user.id,
                                           ))
        s_content, s_memo = self._deal_detail()
        s_content2 = self._items_detail()
        self.record_log(content=s_content.decode("utf8")
                                + s_content2,
                        memo=s_memo)

    def _deal_detail(self):
        l_content = []
        s_memo = ""

        deal = self.get_argument("deal")
        j_deal = json.loads(deal)

        b_pass = int(j_deal.get("pass"))
        s_deal = reportConstant.REPORT_PASS_ENUMS.get(b_pass)

        risk = self.get_argument("risk", reportConstant.REPORT_RISK_FALSE)
        s_risk = reportConstant.REPORT_RISK_ENUMS.get(int(risk))

        l_content.append(s_deal)
        l_content.append(s_risk)

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
            s_memo = str(j_deal.get("memo"))

            l_content.append(s_reason)
            l_content.append(s_m_type)
            l_content.append(s_p_type)
            l_content.append(s_timedelta)

        return " ".join(l_content), s_memo

    def _items_detail(self):
        items = self.get_argument("items")
        d_items = json.loads(items)
        return "\n".join(
            [x.get("url") + x.get("content", " ") for x in d_items])