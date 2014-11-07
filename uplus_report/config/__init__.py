#!/usr/bin/env python
# -*- coding: utf-8 -*-
import os

from config import config

_conf_file_path = os.path.abspath(os.path.dirname(__file__)) + "/"
app = config(_conf_file_path + 'app.ini', raw=True)
api = config(_conf_file_path + 'api.ini')
database = config(_conf_file_path + 'database.ini')