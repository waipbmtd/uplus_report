#!/usr/bin/python
# coding=utf-8
import traceback
import urllib
import urllib2
import logging
from StringIO import StringIO
from tornado import gen
from tornado.httpclient import AsyncHTTPClient, HTTPRequest, HTTPError


def postRequest(url, data=""):
    req = urllib2.Request(url, data=data)
    # logging.debug(printHttpRequest(req))
    try:
        resp = urllib2.urlopen(req)
        return resp.read()
    except urllib2.HTTPError, e:
        logging.error("error request:\nexception : %s\n%s" %
                      (traceback.format_exc(), printHttpRequest(req)))
        return None


def getRequest(url, parameters={}):
    req = urllib2.Request(url + "?" + urllib.urlencode(parameters))
    # logging.debug(printHttpRequest(req))
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


@gen.coroutine
def asyncGetRequest(host, path, parameters={}, callback=None):
    url = "http://%s/%s" % (host, path)
    http_client = AsyncHTTPClient()
    request = HTTPRequest(url + "?" + urllib.urlencode(parameters),
                          method="GET")
    try:
        response = yield http_client.fetch(request, callback=callback)
        raise gen.Return(response)
    except HTTPError, e:
        logging.error("exception : %s : %s : %s" % (e.code,
                                                    e.message,
                                                    str(e.response)))
        raise gen.Return(e)


@gen.coroutine
def asyncPostRequest(host, path, parameters={}, callback=None):
    url = "http://%s/%s" % (host, path)
    http_client = AsyncHTTPClient()
    request = HTTPRequest(url, body=urllib.urlencode(parameters),
                          method="POST")
    try:
        response = yield http_client.fetch(request, callback=callback)
        raise gen.Return(response)
    except HTTPError, e:
        logging.error("exception : %s : %s : %s" % (e.code,
                                                    e.message,
                                                    str(e.response)))
        raise gen.Return(e)


def printHttpRequest(req):
    s = StringIO()
    s.write("url : %s\n" % req.get_full_url())
    s.write("method : %s\n" % req.get_method())
    if req.has_data():
        s.write("data: \n")
        paras = req.get_data().split("&")
        for x in paras:
            x_l = x.split("=")
            s.write("\t%s : %s\n" % (x_l[0], urllib.unquote_plus(x_l[1])))

    s.write("headers: \n")
    for k, v in req.headers.items():
        s.write("\t%s : %s\n" % (k, v))

    for x in s.buflist:
        print x


if __name__ == "__main__":
    pass
    # datetime.timedelta