#!/usr/bin/python
# coding=utf-8
import json
import traceback
import urllib
import urllib2
import logging
from StringIO import StringIO


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
        raise e


def getRequest2(host, path, parameters={}):
    url = "http://%s/%s" % (host, path)
    return getRequest(url, parameters)


def postRequest2(host, path, parameters={}):
    url = "http://%s/%s" % (host, path)
    return postRequest(url, urllib.urlencode(parameters))



def printHttpRequest(req):
    s = StringIO()
    s.write("url : %s\n" % req.get_full_url())
    s.write("method : %s\n" % req.get_method())
    if req.has_data():
        s.write("data: \n")
        paras = req.get_data().split("&")
        for x in paras:
            x_l = x.split("=")
            s.write("\t%s : %s\n" % (x_l[0], x_l[1]))

    s.write("headers: \n")
    for k, v in req.headers.items():
        s.write("\t%s : %s\n" % (k, v))
    return s.getvalue()


if __name__ == "__main__":
    pass
    # datetime.timedelta