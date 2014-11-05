#!/usr/bin/env python
# -*- coding: utf-8 -*-
# 通用工具函数
import decimal
from urllib import unquote
from hashlib import md5
from datetime import date, datetime, timedelta
import time

import config


def hash_password(password):
    salt = config.app.static.get("passwd_salt")
    return md5(md5(str(password)).hexdigest() + salt).hexdigest()


def add_body_arguments(func):
    def wrapper(*args, **kwargs):
        cls = args[0]
        uri = cls.request.body
        mydict = {}
        if '&' in uri:
            for i in uri.split('&'):
                data = i.split('=')
                value = unquote(data[1])
                mydict[data[0]] = [value]
        cls.request.arguments.update(mydict)
        return func(*args, **kwargs)

    return wrapper


def admin_only(method):
    """Wrap request handler methods with this if they are only for admin user.
    """

    def wrapper(self, *args, **kwargs):
        user = self.current_user
        user_cat = user.charactor
        if user_cat != 'admin':
            if user_cat == 'CS':
                self.redirect('/')
            return self.redirect('/')
        return method(self, *args, **kwargs)

    return wrapper


def date_convert(datestr):
    try:
        return datetime.strptime(datestr, config.app.date_format)
    except Exception, e:
        raise e


def datetime_convert(datestr):
    try:
        return datetime.strptime(datestr, config.app.datetime_format)
    except Exception, e:
        raise e


def dthandler(obj):
    """
    将datetime 和 Decimal 类型 parser 为 JSON支持的str类型
    """
    if isinstance(obj, datetime):
        return obj.strftime('%Y-%m-%d %H:%M:%S')
    elif isinstance(obj, date):
        return obj.strftime('%Y-%m-%d')
    elif isinstance(obj, decimal.Decimal):
        return str(obj)
    else:
        raise TypeError('%r is not JSON serializable' % obj)


def utc_mktime(utc_tuple):
    """Returns number of seconds elapsed since epoch

    Note that no timezone are taken into consideration.

    utc tuple must be: (year, month, day, hour, minute, second)

    """

    if len(utc_tuple) == 6:
        utc_tuple += (0, 0, 0)
    return time.mktime(utc_tuple) - time.mktime((1970, 1, 1, 0, 0, 0, 0, 0, 0))


def deltadays(dt1, dt2):
    """
    Difference between two datetime/date values
    :param dt1: datetime.datetime or datetime.date
    :param dt2: datetime.datetime or datetime.date
    :return: datetime.timedelta.days
    """
    if isinstance(dt1, datetime):
        dt1 = dt1.date()
    if isinstance(dt2, datetime):
        dt2 = dt2.date()
    return (dt1 - dt2).days


def split_date(from_date, to_date,
               base_date=datetime.strptime(
                   date.today().strftime(config.app.date_format),
                   config.app.date_format),
               delta_days=0):
    """
    根据分离点split_date和有效偏移天数delta_days将from_date至to_date之间的时间
    分成两个时间段：
    1. 有效的时间段 ： 需要去计算
    2. 无效的时间段 ： 不需要计算，
    :param from_date:
    :param to_date:
    :param base_date:
    :param delta_days:
    :return:
    """
    if deltadays(base_date, from_date) < delta_days:
        return (), (from_date, to_date)

    if deltadays(to_date, base_date) <= delta_days:
        return (from_date, to_date), ()

    return (from_date, base_date), (base_date + timedelta(1), to_date)


def split_date_list(date_list,
                    base_date=datetime.strptime(
                        date.today().strftime(config.app.date_format),
                        config.app.date_format)):
    ds1 = []
    ds2 = []
    for d in date_list:
        if deltadays(base_date, d) >= 0:
            ds1.append(d)
        else:
            ds2.append(d)
    return ds1, ds2


if __name__ == "__main__":
    f_date = datetime(2014, 1, 18)
    t_date = datetime(2014, 10, 17)
    print split_date(f_date, t_date)