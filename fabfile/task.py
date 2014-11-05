# coding: utf-8

from fabric.api import *
from fabric.contrib.project import rsync_project
 
import config

@hosts()
def upload_project():
    rsync_project(local_dir="../youjia_statistics", remote_dir="~/Envs/youjia_statistics/", exclude=['*.pyc','.*'])
    run('ls -l ~/Envs/youjia_statistics')
    

@hosts()
def deploy_to_workdir():
    run('sudo rsync -av ~/dist/youjia_statistics /srv')
    run('sudo chown -R www.www /srv/youjia_statistics')


def deploy():
    upload_project()
    # deploy_to_workdir()
