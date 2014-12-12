#!/usr/bin/python
# coding=utf-8

API_RET_YES = 0
API_RET_NO = 1

# 通过状态
REPORT_PASS_YES = 1
REPORT_PASS_NO = 0

REPORT_PASS_ENUMS = {
    REPORT_PASS_YES: "通过",
    REPORT_PASS_NO: "没有通过"
}

# 用户区分
USER_SYSTEM = "系统用户"
USER_HIGH_RISK = "高危用户"
USER_SPECIAL = "特殊用户"

# 是否高危
REPORT_TYPE_COMM = 0
REPORT_TYPE_RISK = 1
REPORT_TYPE_RESOURCE = 2

# 级别
REPORT_TYPE_ENUMS = {
    REPORT_TYPE_COMM: '普通',
    REPORT_TYPE_RISK: '高危',
    REPORT_TYPE_RESOURCE: '资源',
}

# 资源来源
IMAGE_FROM_ALBUM = 101
IMAGE_FROM_GIFT = 102
IMAGE_FROM_LIAOTIAN = 103
IMAGE_FROM_BIAOQING = 104
IMAGE_FROM_SHOW = 105
IMAGE_FROM_HALL = 106
THUMB_IMAGE_FROM_SHILIAO_VIDEO = 107
THUMB_IMAGE_FROM_SHOW_VIDEO = 108
IMAGE_FROM_GROUP = 109
THUMB_IMAGE_FROM_GROUP_VIDEO = 110

AUDIO_FROM_LIAOTIAN = 203
AUDIO_FROM_SHOW = 205
AUDIO_FROM_HALL = 206
AUDIO_FROM_GROUP = 207

VIDEO_FROM_SHILIAO = 303
VIDEO_FROM_GROUP = 304
VIDEO_FROM_SHOW = 305
VIDEO_FROM_HALL = 306

COVER_FROM_GROUP = 401

#资源来源类型
RESOURCE_FROM_ENUMS = {
    IMAGE_FROM_ALBUM: "用户相册图片",
    IMAGE_FROM_GIFT: "礼物图片",
    IMAGE_FROM_LIAOTIAN: "聊天图片",
    IMAGE_FROM_BIAOQING: "动态表情",
    IMAGE_FROM_SHOW: "秀场图片",
    IMAGE_FROM_HALL: "大厅图片",
    THUMB_IMAGE_FROM_SHILIAO_VIDEO: "私聊视频缩略图",
    THUMB_IMAGE_FROM_SHOW_VIDEO: "秀场视频缩略图",
    IMAGE_FROM_GROUP: "群组图片",
    THUMB_IMAGE_FROM_GROUP_VIDEO: "群组视频缩略图",

    AUDIO_FROM_LIAOTIAN: "聊天音频文件",
    AUDIO_FROM_SHOW: "秀场音频文件",
    AUDIO_FROM_HALL: "大厅音频文件",
    AUDIO_FROM_GROUP: "群组音频文件",


    VIDEO_FROM_SHILIAO: "私聊视频",
    VIDEO_FROM_GROUP: "群视频",
    VIDEO_FROM_SHOW: "秀场视频",
    VIDEO_FROM_HALL: "大厅视频",

    COVER_FROM_GROUP: "群封面"
}

#消息类型
MESSAGE_TYPES_ENUMS = {
    1: "文本",
    2: "图片",
    3: "声音",
    8: "视频",
}


#禁止资源类型
FORBIDDEN_RESOURCE_TYPES_ENUMS = {
    0: "文本",
    1: "图片",
    2: "声音",
    3: "视频",
}

# 请求
REQUEST_TYPES = {
    1: "失败",
    0: "成功",
}

REPORT_REASON_ADS = 1
REPORT_REASON_SEX = 2
REPORT_REASON_SENSITIVE_TOPIC = 3
# 被封原因
REPORT_REASONS = {
    1: "广告",
    2: "色情",
    3: "敏感话题",
}


# 业务场所
REPORT_MODULE_TYPE_HALL = 1
REPORT_MODULE_TYPE_SHOW = 2
REPORT_MODULE_TYPE_GROUP = 3
REPORT_MODULE_TYPE_USER = 4

REPORT_MODULE_TYPES = {
    REPORT_MODULE_TYPE_HALL: '大厅',
    REPORT_MODULE_TYPE_SHOW: '秀场',
    REPORT_MODULE_TYPE_GROUP: '群',
    REPORT_MODULE_TYPE_USER: '用户',
}

# 惩罚类型
REPORT_PUNISH_SILENCE = 101
REPORT_PUNISH_CLOSE_SHOW = 102
REPORT_PUNISH_DELETE_RESOURCE = 103
REPORT_PUNISH_LOGIN_LIMIT = 104
REPORT_PUNISH_DISMISS_GROUP = 105
REPORT_PUNISH_KICK_OUT_GROUP = 106

REPORT_PUNISHES = {
    REPORT_PUNISH_SILENCE: '禁言',
    REPORT_PUNISH_CLOSE_SHOW: '关闭秀场',
    REPORT_PUNISH_DELETE_RESOURCE: '删除资源',
    REPORT_PUNISH_LOGIN_LIMIT: '登录限制',
    REPORT_PUNISH_DISMISS_GROUP: '解散群',
    REPORT_PUNISH_KICK_OUT_GROUP: '踢出群',
}

REPORT_PUNISH_PASSED = "审核通过"

REPORT_HALL_OPEN_MOUTH = "大厅禁言解除"

REPORT_SHOW_OPEN_MOUTH = "秀场禁言解除"
REPORT_SHOW_UNLOCK = "秀场解封"

REPORT_USER_UNLOCK = "用户解封"

# 关联关系
PUNISH_RELATION = {
    "reasons": [dict(id=x, title=REPORT_REASONS[x]) for x in REPORT_REASONS],
    "module_types": [
        {"id": REPORT_MODULE_TYPE_HALL,
         "title": REPORT_MODULE_TYPES.get(
             REPORT_MODULE_TYPE_HALL),
         "punishes": [
             {"id": REPORT_PUNISH_SILENCE,
              "title": REPORT_PUNISHES.get(REPORT_PUNISH_SILENCE),
              "required_time": True},
             {"id": REPORT_PUNISH_DELETE_RESOURCE,
              "title": REPORT_PUNISHES.get(
                  REPORT_PUNISH_DELETE_RESOURCE),
              "required_time": False}
         ]
        },
        {"id": REPORT_MODULE_TYPE_SHOW,
         "title": REPORT_MODULE_TYPES.get(
             REPORT_MODULE_TYPE_SHOW),
         "punishes": [
             {"id": REPORT_PUNISH_SILENCE,
              "title": REPORT_PUNISHES.get(REPORT_PUNISH_SILENCE),
              "required_time": True},
             {"id": REPORT_PUNISH_CLOSE_SHOW,
              "title": REPORT_PUNISHES.get(
                  REPORT_PUNISH_CLOSE_SHOW),
              "required_time": True},
             {"id": REPORT_PUNISH_DELETE_RESOURCE,
              "title": REPORT_PUNISHES.get(
                  REPORT_PUNISH_DELETE_RESOURCE),
              "required_time": False},
             # {"id": REPORT_PUNISH_LOGIN_LIMIT,
             # "title": REPORT_PUNISHES.get(
             #      REPORT_PUNISH_LOGIN_LIMIT),
             #  "required_time": True}
         ]
        },
        {"id": REPORT_MODULE_TYPE_GROUP,
         "title": REPORT_MODULE_TYPES.get(
             REPORT_MODULE_TYPE_GROUP),
         "punishes": [
             {"id": REPORT_PUNISH_DELETE_RESOURCE,
              "title": REPORT_PUNISHES.get(
                  REPORT_PUNISH_DELETE_RESOURCE),
              "required_time": False},
             {"id": REPORT_PUNISH_DISMISS_GROUP,
              "title": REPORT_PUNISHES.get(
                  REPORT_PUNISH_DISMISS_GROUP),
              "required_time": False},
             {"id": REPORT_PUNISH_KICK_OUT_GROUP,
              "title": REPORT_PUNISHES.get(
                  REPORT_PUNISH_KICK_OUT_GROUP),
              "required_time": False}
         ]
        },
        {"id": REPORT_MODULE_TYPE_USER,
         "title": REPORT_MODULE_TYPES.get(
             REPORT_MODULE_TYPE_USER),
         "punishes": [
             {"id": REPORT_PUNISH_DELETE_RESOURCE,
              "title": REPORT_PUNISHES.get(
                  REPORT_PUNISH_DELETE_RESOURCE),
              "required_time": False},
             {"id": REPORT_PUNISH_LOGIN_LIMIT,
              "title": REPORT_PUNISHES.get(
                  REPORT_PUNISH_LOGIN_LIMIT),
              "required_time": True}
         ]
        }
    ]
}

MOD_ENUM = {
    11: "大厅消息",
    12: "私聊消息",
    13: "群消息",
    14: "秀场消息",
    15: "相册图",
    16: "秀册内的资源",

    21: "大厅",
    22: "群profile",
    23: "个人profile",
    24: "秀场",
    25: "私聊",
    26: "群聊",
}


def validate_punishes(module_type, punish):
    mts = PUNISH_RELATION.get("module_types")
    for mt in mts:
        if mt["id"] == module_type:
            puns = mt["punishes"]
            return punish in [x["id"] for x in puns]
    return False


if __name__ == "__main__":
    print validate_punishes(REPORT_MODULE_TYPE_USER,
                            REPORT_PUNISH_DELETE_RESOURCE)
    print validate_punishes(REPORT_MODULE_TYPE_USER, REPORT_PUNISH_LOGIN_LIMIT)
    print validate_punishes(REPORT_MODULE_TYPE_USER, REPORT_PUNISH_CLOSE_SHOW)