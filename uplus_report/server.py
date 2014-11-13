#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
import logging

import tornado.ioloop
import tornado.web
import tornado.escape
from tornado.options import define, options
import tornado.log

import config
from handlers import uimodules
import routers


def config_logging():
    level = config.app.logging.get("level")
    fmt = config.app.logging.get("format", None)
    if fmt:
        logging.basicConfig(format=fmt)
    if level:
        tornado.options.options.logging = level


def remote_debug():
    remote = config.app.remote
    if remote and remote.get("debug") == "True":
        try:
            import pydevd

            host = remote.get("host")
            port = remote.get("port")
            pydevd.settrace(host, port=int(port), stdoutToServer=True,
                            stderrToServer=True)
        except ImportError:
            logging.error("remote debug start fail! need pycharm-debug.egg!")


class Application(tornado.web.Application):
    def __init__(self):
        routes = routers.routers
        settings = dict(
            debug=options.debug,
            site_title=config.app.site_title,
            cookie_secret=config.app.cookie_secret,
            xsrf_cookies=False,
            template_path=os.path.join(os.path.dirname(__file__), "template"),
            static_path=os.path.join(os.path.dirname(__file__), "resource"),
            login_url="/login",
            ui_modules=uimodules,
            autoescape=None,
        )
        tornado.web.Application.__init__(self, routes, **settings)


def main():
    config_logging()
    remote_debug()
    logging.info("server start...")

    from storage.mysql.database import init_db

    init_db()

    define("dev", default=False, help="Is development env?", type=bool)
    define("port", default=8205, help="run on the given port", type=int)
    define("debug", default=True, help="is debug model?", type=bool)

    tornado.options.parse_command_line()

    app = Application()
    app.listen(options.port)

    logging.info(
        "Statistics server run on the %s and the debug model is %s" % (
            options.port, options.debug))
    tornado.ioloop.IOLoop.instance().start()


if __name__ == "__main__":
    main()
