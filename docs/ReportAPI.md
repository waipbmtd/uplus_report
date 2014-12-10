# 遵循 公司统一 默认协议规则 

# 数据约定
{ret:0,code:"":info""}  
ret: 0 成功 1 失败
code: 状态码
info: 状态信息

is
## 举报接口 举报类型
GET/POST http://domain/v/{client_version}/t/{client_type}/report/report_type?token={}&uid={user_id}

####返回
区分用户是否为管理员  
  普通用户显示 1、2、3
  管理员显示 4、5、6

```
{
   [{id:1,name:"色情"},
   {id:2, name:"广告"}，
   {id:3,name:"敏感话题"},

   {id:4,name:"删除"},
   {id:5,name:"禁言"},
   {id:6,name:"封号"} …… ]
}
```

## 举报接口 消息类型
POST http://domain/v/{client_version}/t/{client_type}/report/reportmsg?token={}&uid={user_id}

```
BODY
{
	mod：{功能模块},  #int
	reporter:{举报人id}, #string
	type:[1,2,3], # list int
	msgs:
	[{msg_type:{消息类型}, #int
	msgid:{内容id}, #string
	uucid:{uucid},   #string
	senderid:{发送者id}, #string
	url:{资源URL}, #string
	thumburl:{缩略图} #string
	content:{消息内容}}], #string
	profile:
	{
	mid:{场所iD（ 群id、秀场id）}, #string
        oid:{owner id} #string
	name:{名字}  #string
	desc:{描述}  #string
	},
        buid:{被举报人ID },#string
	memo:{扩充字段}  #string
```
      #buid:{被举报人ID },#string 说明 消息为单条时需要携带\个人profile\私聊天时携带
      11~16、23、25需要携带 buid
      21、24、26 单挑消息时携带 buid
      补充说明：
      11、12、13、14、16、buid=senderid
      21、24、26 单条消息时 buid=senderid 多条时不要携带buid
      23、25、15 时是 userprofile 中的userid
      
```
mod  int (举报入口)
 1. 针对单条内容的：（举报直接上传内容，不进入举报界面）
  11). 大厅消息；（长按大厅内用户发送的单条消息出现入口，选择举报类型后直接上传对应的消息id）
        profile NULL， msgs 1
  12). 私聊消息；（长按私聊内用户发送的单条消息出现入口，选择举报类型后直接上传对应的消息id）
        profile {name:用户名称   desc:用户描述} ， msgs 1  
  13). 群消息；（长按群聊内用户发送的单条消息出现入口，选择举报类型后直接上传对应的消息id）
	profile {name:群名称   desc:群描述}， msgs 1 
  14). 秀场消息；（长按群聊内用户发送的单条消息出现入口，选择举报类型后直接上传对应的消息id）
        profile {name:用户名称   desc:秀场名称}， msgs 1 
  15). 相册图；（相册大图浏览界面提供入口，选择举报类型后直接上传对应的资源url）
        profile {name:用户名称   desc:用户描述}  ， msgs 1 且只有url 
  16). 秀册内的资源；（秀册大图浏览界面提供入口，选择举报类型后直接上传对应的资源url）
        profile {name:用户名称   desc:秀场名称}   ， msgs 1 
 2. 针对业务单元的： （需要进入举报界面，选择举报类型和待上传消息记录）
  21). 大厅；（大厅增加举报入口，需要选择本地缓存的大厅内消息记录上传；如果用户没有选消息，就自动将本地最新的10条记录上传）
         profile NULL， msgs 1~10
  22). 群profile；（群profile查看界面提供入口）
         profile {name:群名称   desc:群描述}， msgs 0
  23). 个人profile；（个人profile查看界面提供入口）
         profile {name:用户名称   desc:用户描述} ， msgs 0
  24). 秀场； （秀场界面提供入口，需要选择本地缓存的秀场内消息记录上传；如果用户没有选消息，就自动将本地最新的秀主嘉宾，和观众消息各10条记录上传）
         profile {name:用户名称   desc:秀场名称}， msgs 1~10
  25). 私聊；（私聊操作菜单里提供入口，需要选择本地缓存的私聊消息记录上传；如果用户没有选消息，就自动将本地最新的10条记录上传）
         profile {name:用户名称   desc:用户描述} ， msgs 1~10
  26). 群聊；（私聊操作菜单里提供入口，需要选择本地缓存的群聊消息记录上传；如果用户没有选消息，就自动将本地最新的10条记录上传）
         profile {name:群名称   desc:群描述} ， msgs 1~10
```
##统一操作
* 根路径 http://domain:port/xxxApp/api
* 统一返回 {'ret':1|0,'code':'','info':''}

##惩罚接口
* 封号：/close/mt/1/uid/10000?mid=&mod=11&reason=1&timedelta=48&rid=22&cid=1&reporter=1002
* 禁言：/silence/mt/1/uid/10000?mid=&mod=11&reason=1&timedelta=48&rid=22&cid=1&reporter=1002
* 解散：/dismiss?uid=10000&mid=&mod=11&reason=1&timedelta=48&rid=22&cid=1&reporter=1002
* 踢人：/kickout?uid=10000&mid=&mod=11&reason=1&timedelta=48&rid=22&cid=1&owner=1001&reporter=1002

>
        参数说明(参数必填，无值时留空)：
        mt 全称”Module Type“，1大厅，2秀场，3群, 4用户（根据mod判断之后传入）
        uid 用户Id
        mid 对应的秀场Id或群Id
        mod 模块标识号
        reason 禁言原因:色情/广告/敏感信息
        timedelta 时长 -1 永久 大于0 为具体时长
        rid 关联举报信息记录的id
        cid 客服Id
        reporter 举报者Id


##资源相关  (res/del)
* 删除资源 /res/del?uid=10000&reason=1&mod=11&url=xxx/xxx/xx.png&thumb_url=xxx/x/x.png&msgId=11&cid=1213
* 检查资源 /res/check?uid=10000&url=xxx/jsp/zz.png

##审核通过 (pass)
* /pass?rid=1&cid=1111112&reporter=100

##解除禁言(openmouth)
* 大厅禁言解除 /openmouth/hall?uid=10000&cid=10002
* 秀场禁言解除 /openmouth/show/{showId}?uid=10000&cid=10002

##解封(unlock)
* 秀场解封 /unlock/show/{showId}?cid=10002
* 用户解封 /unlock/user/{uid}?cid=10002


# 其它
---

#####  消息   
  * 消息类型:  
        public static final int CHATROOM_MSGTYPE_TEXT = 1; 文本消息     
	public static final int CHATROOM_MSGTYPE_PIC = 2; 图片消息     
	public static final int CHATROOM_MSGTYPE_AUDIO = 3; 声音消息     
	public static final int CHATROOM_MSGTYPE_VIDEO = 8; // 视频     

