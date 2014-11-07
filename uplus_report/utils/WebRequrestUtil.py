#!/usr/bin/python
# coding=utf-8
import json
import traceback
import urllib
import urllib2
import logging
from StringIO import StringIO
import datetime


def postRequest(url, data=""):
    req = urllib2.Request(url, data=data)
    logging.debug(printHttpRequest(req))
    try:
        resp = urllib2.urlopen(req)
        return resp.read()
    except urllib2.HTTPError, e:
        logging.error("error request:\nexception : %s\n%s" %
                      (traceback.format_exc(), printHttpRequest(req)))
        return None


def getRequest(url, parameters={}):
    req = urllib2.Request(url + "?" + urllib.urlencode(parameters))
    logging.debug(printHttpRequest(req))
    try:
        resp = urllib2.urlopen(req)
        return resp.read()
    except urllib2.HTTPError, e:
        logging.error("error request:\nexception : %s\n%s" %
                      (traceback.format_exc(), printHttpRequest(req)))


def getRequest2(host, path, parameters={}):
    url = "http://%s/%s" % (host, path)
    return getRequest(url, parameters)



def printHttpRequest(req):
    s = StringIO()
    s.write("url : %s\n" % req.get_full_url())
    s.write("method : %s\n" % req.get_method())
    if req.has_data():
        s.write("data: \n")
        for k, v in json.loads(req.get_data()).items():
            s.write("\t%s : %s\n" % (k, v))

    s.write("headers: \n")
    for k, v in req.headers.items():
        s.write("\t%s : %s\n" % (k, v))
    return s.getvalue()


if __name__ == "__main__":
    pass
    # datetime.timedelta