#!/usr/bin/env python
# -*-coding: utf-8 -*-
import tornado.web


class Navbar(tornado.web.UIModule):
    def render(self):
        return self.render_string(
            "partial/navbar.html", username=self.current_user.username)