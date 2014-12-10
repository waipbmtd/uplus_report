
# 前端接口

###  WEB接口
---

#####  登录  
POST   /login   

参数：
   * 必选：  
      username : 用户名    
      password : 密码    
   *  可选：   
      next : 登录之后访问的路径，默认为“/”    

返回：  
>
        跳转到"index.html"
        
        
#####  登出  
POST   /logout      

参数：
   * 必选：  
   *  可选：   

返回：  
>
        跳转到"login.html"


#####获取关联信息  
GET   /punish_enum_relation   

参数：

返回：  
>
	{ret:1,
         info:'',
	data:{
		 "reasons": 违规类型列表
		     [{"id": , 违规类型ID
		        "title": 违规类型title
		    },
		    { ...  }  …
		    ],
		 "module_types": 处罚业务单元
		     [{"id": , 处罚业务单元ID
		        "title": 处罚业务单元title,
		        "punishes" : 有效的处罚类型
		              [{"id": , 违规类型ID
		                "title": 违规类型title
		                "required_time": 是否需要指定时间（True/False）
		              },
		              { ...  }  …
		              ]
		       },
		       {…},  …
		    ]
	     }
          }
          
          
#####获取入口MOD枚举  
GET   /enum/entrance_mod   

参数：

返回：  
>
	{ret:1,
         info:'',
	data:{
		'11' : '大厅消息',
		'12' : '私聊消息'
	     }
        }

#####  剩余未处理的举报数
POST   /report/remain 

参数：
   * 必选：        
   * 可选： 
     risk : 是否高危（ 0:普通，1：高危 default=0）

返回：  
>
        {"ret":0,"data":{"msg_remain":1789,"album_remain":2127}}  
        

#####获取下一批相册图片
GET /report/album_image/list   

参数：
   * 可选：    
      size : 一次拉的图片数（default=20）  
      risk : 是否高危（ 0:普通，1：高危 default=0）

返回：  
>
返回值:
>
	{ret:1,
	info: ''
	data:{
          [{  id : 关联举报记录 的id(唯一标识符)，
              url: 图片的url，
              thumb_url： 图片缩略图url
              reporter: 举报者，
              u_id: 被举报的人， 
              mod: 举报入口
	      mid: 模块ID
              },{...},...]     
	    }
        }
        
        
#####获取下一个被举报message
GET /report/message/next   

参数：  
   * 可选：   
     risk : 是否高危（ 0:普通，1：高危 default=0）  

返回值:
>
	{ret:1,
	info: ''
	data:{
	    id:{举报记录id},  #int
	    mod：{功能模块},  #int
	    reporter:{举报人id}, #string
	    type:[1,2,3], # list int
	    buid:{被举报人ID },#string
	    memo:{扩充字段}  #string
	    msgs:
	    	[
		{   msg_type:{消息类型}, #int
		    msgid:{内容id}, #string
		    uucid:{uucid},   #string
		    senderid:{发送者id}, #string
		    url:{资源URL}, #string
		    thumburl:{缩略图} #string
		    content:{消息内容}
		}，
	    	], #string
	    profile:{
		    mid:{场所iD（ 群id、秀场id）}, #string
		    oid:{owner id} #string
		    name:{名字}  #string
		    desc:{描述}  #string
	    	}
	    }
        }
        
##### 处罚接口
POST  /punish

参数 ：
  *   必选：    
       module_type ： 处罚的业务单元（1大厅，2秀场，3群, 4用户）    
       punish_type  :  处罚的类型 （    101: '禁言', 102: '关闭秀场',103: '删除资源',104: '登录限制',105: '解散群',106: '踢出群',）    
       reason： 处罚的原因（    1: "广告",2: "色情", 3: "敏感话题",）    
       reporter： 举报人ID    
       u_id ： 被举报人ID    
       id : 举报记录表的ID    
       mod： 举报入口ID    
       
       
  *  可选：   
       timedelta  ： 处罚的时长（缺省-1,表示永久）   
       memo : 处罚的备注解释   
       url  ： 资源url   
       thumb_url: （对图片/视频而言为缩略图URL）  
       content: 文字     
       module_id：秀场/群的ID    
       msg_id： 消息的ID    
       owner： 拥有者ID   
       

   返回：  
   >      {ret:1,info:'',code:''}    
 
        
##### 通过
POST  /pass

参数 ：
  *   必选：    
       reporter： 举报人ID    
       u_id ： 被举报人ID    
       id : 举报记录表的ID    
       mod： 举报入口ID    
       
  *  可选：   
       url  ： 资源url   
       thumb_url: （对图片/视频而言为缩略图URL）   
       content: (如果是文字)
       module_id：秀场/群的ID    
       msg_id： 消息的ID    
       owner： 拥有者ID    

   返回：  
   >      {ret:1,info:'',code:''}   
   
   
#####  大厅解除禁言  
POST   /hall/open_mouth  

参数：
   * 必选：  
      u_id : 用户ID         
   *  可选：   
      memo : 备注  

返回：  
>
        {ret:0}


#####  秀场解除禁言   
POST   /show/open_mouth 

参数：
   * 必选：  
      show_id : 秀场ID         
   *  可选：   
      memo : 备注  

返回：  
>
        {ret:0}


#####  秀场解除封禁      
POST   /show/un_clock

参数：
   * 必选：  
      show_id : 秀场ID         
   *  可选：   
      memo : 备注  

返回：  
>
        {ret:0}


#####  用户解除封禁      
POST   /user/un_clock

参数：
   * 必选：  
      u_id : 秀场ID        
   *  可选：   
      memo : 备注  

返回：  
>
        {ret:0}
        
#####  获取所有高危用户列表        
GET   /user/risk/list  

参数：  
   * 必选：  

返回：   
>
        {ret:0, data={[
		{user_id: 用户ID,  
		create_time:创建时间  
		},{...},...  
		]
	}}


#####  添加一个高危用户      
POST   /user/risk

参数：
   * 必选：  
      user_id : 用户id        

返回：  
>
        {ret:0}


#####  获取一个高危用户      
GET   /user/risk

参数：
   * 必选：  
      user_id : 用户id        

返回：  
>
        {ret:0, data={user_id: 用户ID  
		create_time: 创建时间  
	}}

#####  删除一个高危用户       
DELETE   /user/risk 

参数：
   * 必选：  
      user_id : 用户id          

返回：  
>
        {ret:0, data={user_id: 用户ID  
	}}  

#####  获取所有特殊用户列表        
GET   /user/special/list  

参数：  
   * 必选：  

返回：   
>
        {ret:0, data={[
		{user_id: 用户ID,  
		create_time:创建时间  
		},{...},...  
		]
	}}


#####  添加一个特殊用户      
POST   /user/special

参数：
   * 必选：  
      user_id : 用户id        

返回：  
>
        {ret:0}


#####  获取一个特殊用户      
GET   /user/special

参数：
   * 必选：  
      user_id : 用户id        

返回：  
>
        {ret:0, data={user_id: 用户ID  
		create_time: 创建时间  
	}}

#####  删除一个特殊用户       
DELETE   /user/special 

参数：
   * 必选：  
      user_id : 用户id          

返回：  
>
        {ret:0, data={user_id: 用户ID  
	}}  

### server接口
---

##### 获取一批新的像册待审核图片
GET uplus-report/api/get_pic_list

参数： 
   * 必选：   
      csid : 客服ID    
      risk : 是否高危(1:高危，0：普通)     
   * 可选 ：
      size : 一次拉的图片数（default=20）  
  
返回值:
>
	{ret:1,
	info: ''
	data:{
          [{  id : 关联举报记录 的id(唯一标识符)，
              url: 图片的url，
              thumb_url： 图片缩略图url
              reporter: 举报者，
              u_id: 被举报的人， 
              mod: 举报入口
	      mid: 模块ID
              }]     
		}
        }

##### 获取下一条被举报消息记录
GET uplus-report/api/get_next_report

参数： 
   * 必选：     
       csid : 客服ID    
       risk : 是否高危(1:高危，0：普通)     
           
  
返回值:
>     
	{ret:1,
	info: ''
	data:{
	    mod：{功能模块},  #int
	    reporter:{举报人id}, #string
	    type:[1,2,3], # list int
	    buid:{被举报人ID },#string
	    memo:{扩充字段}  #string
	    msgs:
	    	[
		{   msg_type:{消息类型}, #int
		    msgid:{内容id}, #string
		    uucid:{uucid},   #string
		    senderid:{发送者id}, #string
		    url:{资源URL}, #string
		    thumburl:{缩略图} #string
		    content:{消息内容}
		}，
	    	], #string
	    profile:{
		    mid:{场所iD（ 群id、秀场id）}, #string
		    oid:{owner id} #string
		    name:{名字}  #string
		    desc:{描述}  #string
	    	}
	    }
        }


#####  剩余未处理的举报数
POST   uplus-report/api/get_remain_report

参数：
   * 必选：     
     risk : 是否高危(1:高危，0：普通)     

返回：  
>
        {"ret":0,"data":{"msg_remain":1789,"album_remain":2127}}  

# 其它
---

*  [**处罚接口**与**被举报message**参数对照](https://github.com/youjia/youjia-api/blob/master/docs/report-profile-punish.JPG "参数图解")   

* 惩罚关联：

>     
    "reasons": [
        {
            "id": 1,
            "title": "广告"
        },
        {
            "id": 2,
            "title": "色情"
        },
        {
            "id": 3,
            "title": "敏感话题"
        }
    ],
    "module_types": [
        {
            "punishes": [
                {
                    "required_time": true,
                    "id": 101,
                    "title": "禁言"
                },
                {
                    "required_time": false,
                    "id": 103,
                    "title": "删除资源"
                }
            ],
            "id": 1,
            "title": "大厅"
        },
        {
            "punishes": [
                {
                    "required_time": true,
                    "id": 101,
                    "title": "禁言"
                },
                {
                    "required_time": true,
                    "id": 102,
                    "title": "关闭秀场"
                },
                {
                    "required_time": false,
                    "id": 103,
                    "title": "删除资源"
                },
                {
                    "required_time": true,
                    "id": 104,
                    "title": "登录限制"
                }
            ],
            "id": 2,
            "title": "秀场"
        },
        {
            "punishes": [
                {
                    "required_time": false,
                    "id": 103,
                    "title": "删除资源"
                },
                {
                    "required_time": false,
                    "id": 105,
                    "title": "解散群"
                },
                {
                    "required_time": false,
                    "id": 106,
                    "title": "踢出群"
                }
            ],
            "id": 3,
            "title": "群"
        },
        {
            "punishes": [
                {
                    "required_time": false,
                    "id": 103,
                    "title": "删除资源"
                },
                {
                    "required_time": true,
                    "id": 104,
                    "title": "登录限制"
                }
            ],
            "id": 4,
            "title": "用户"
        }
    ],
