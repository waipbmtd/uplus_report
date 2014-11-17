#!/usr/bin/env python
# -*-coding: utf-8 -*-
import tornado.web


class PageInclude(tornado.web.UIModule):
    def render(self, path):
        return self.render_string("render/" + path + ".html")