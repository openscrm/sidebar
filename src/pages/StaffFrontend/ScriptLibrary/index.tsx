import React, {useEffect, useState} from 'react';
import ProCard from "@ant-design/pro-card";
import BottomNavBar from "@/pages/StaffFrontend/Components/BottomNavBar";
import styles from "./index.less";
import {Button, Collapse, Empty, Image, Input, message, Space} from 'antd';
import Icon, {CaretRightFilled, createFromIconfontCN, PlusCircleFilled} from "@ant-design/icons";
import {ModalForm, ProFormText} from "@ant-design/pro-form";
import {humanFileSize, isImg, isUrl} from "@/utils/utils";
import defaultSettings from "../../../../config/defaultSettings";
import {
  ReplyDetail,
  ScriptLibraryGroupItem,
  SearchScriptLibraryGroup
} from "@/pages/StaffFrontend/ScriptLibrary/service";
import {CommonItemsResp, CommonResp, UploadMedia, UploadMediaResult} from "@/services/common";
import pdfImage from "@/assets/pdf-png.png";
import {ExpandableParagraph} from "@/pages/StaffFrontend/Components/ExpandableParagraph";
import fileIconImage from "@/assets/file-icon-image.svg";

const IconFont = createFromIconfontCN({
  scriptUrl: defaultSettings.iconfontUrl,
});

const getIcon = (
  icon?: string | React.ReactNode,
  iconPrefixes: string = 'icon-',
): React.ReactNode => {
  if (typeof icon === 'string' && icon !== '') {
    if (isUrl(icon) || isImg(icon)) {
      return (
        <Icon component={() => <img src={icon} alt="icon" className="ant-pro-sider-menu-icon"/>}/>
      );
    }
    if (icon.startsWith(iconPrefixes)) {
      return <IconFont type={icon}/>;
    }
  }
  return icon;
};

const SendQuickReply = async (replyDetail: ReplyDetail) => {
  let media_id = "";
  let msg_type: string = replyDetail.quick_reply_content.msg_type || "";
  if (msg_type === "link") {
    msg_type = "news";
  }
  if (msg_type === "pdf") {
    msg_type = "file";
  }
  if (['image', 'file', 'video'].includes(msg_type)) {
    const url = replyDetail.quick_reply_content.image.picurl || replyDetail.quick_reply_content.pdf.fileurl || replyDetail.quick_reply_content.video.picurl
    const hide = message.loading("素材准备中");
    // @ts-ignore
    const res = await UploadMedia(msg_type, url) as CommonResp<UploadMediaResult>;
    hide();
    if (res.code !== 0) {
      console.log(res.message);
      message.error("消息素材上传失败");
      return
    }

    media_id = res.data.media_id
  }

  // @ts-ignore
  window.wx.invoke('sendChatMessage', {
    msgtype: msg_type, // 消息类型，必填
    enterChat: true, // 为true时表示发送完成之后顺便进入会话，仅移动端3.1.10及以上版本支持该字段
    text: {
      content: replyDetail.quick_reply_content.text.content, // 文本内容
    },
    image:
      {
        mediaid: media_id, // 图片的素材id
      },
    video:
      {
        mediaid: media_id, // 视频的素材id
      },
    file:
      {
        mediaid: media_id, // 文件的素材id
      },
    news:
      {
        link: replyDetail.quick_reply_content.link.url, // H5消息页面url 必填
        title: replyDetail.quick_reply_content.link.title, // H5消息标题
        desc: replyDetail.quick_reply_content.link.desc, // H5消息摘要
        imgUrl: replyDetail.quick_reply_content.link.picurl, // H5消息封面图片URL
      },
    // miniprogram:
    //   {
    //     appid: "wx8bd80126147df384",// 小程序的appid
    //     title: "this is title", // 小程序消息的title
    //     imgUrl: "https://search-operate.cdn.bcebos.com/d054b8892a7ab572cb296d62ec7f97b6.png",// 小程序消息的封面图。必须带http或者https协议头，否则报错 $apiName$:fail invalid imgUrl
    //     page: "/index/page.html", // 小程序消息打开后的路径，注意要以.html作为后缀，否则在微信端打开会提示找不到页面
    //   },
  }, (result: any) => {
    if (result.err_msg === 'sendChatMessage:ok') {
      // 发送成功
      return;
    }
    console.log("result", result);
    console.log("replyDetail", replyDetail);
    message.error(result.err_msg)
  })

}

const BatchSendQuickReply = async (replyDetails: ReplyDetail[]) => {
  // eslint-disable-next-line no-restricted-syntax
  for (const replyDetail of replyDetails) {
    // eslint-disable-next-line no-await-in-loop
    await SendQuickReply(replyDetail)
  }
}

const ScriptLibraryList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [groups, setGroups] = useState<ScriptLibraryGroupItem[]>([]);
  const [keyword, setKeyword] = useState<string>("");

  useEffect(() => {
    setLoading(true);
    SearchScriptLibraryGroup({
      page_size: 5000,
      keyword
    }).then((res: CommonItemsResp<ScriptLibraryGroupItem>) => {
      setLoading(false);
      if (res.code !== 0) {
        message.error("获取话术库分组失败");
        return
      }

      setGroups(res.data.items)
    })
  }, [keyword])

  return (
    <div className={styles.scriptLibraryContainer}>
      <ProCard
        tabs={{
          type: 'line',
        }}
      >
        <ProCard.TabPane key="corp" tab="企业话术">
          <div>
            <Input.Search placeholder="输入关键词" loading={loading} allowClear onSearch={(value) => {
              setKeyword(value);
            }}/>
          </div>

          <div hidden={true}>
            <Button
              type={'link'}
              style={{padding: 0, marginTop: 12}}
              icon={<PlusCircleFilled style={{color: '#1966ff'}}/>}
              onClick={() => setCreateModalVisible(true)}
            >新建分组</Button>
          </div>

          <div>
            {groups.length === 0 && (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>
            )}
            {groups.length > 0 && (
              <Collapse expandIcon={(panelProps) => {
                const rotate = panelProps.isActive ? 90 : 0;
                return <CaretRightFilled rotate={rotate} style={{fontSize: 10, color: 'rgba(66,66,66,0.65)'}}/>
              }} ghost>
                {groups.map((group) => (
                  <Collapse.Panel header={<>{group.name}({group?.quick_replies?.length})</>} key={group.id}>
                    {group?.quick_replies && group?.quick_replies?.length > 0 && (
                      <div className={styles.scriptList}>
                        {group.quick_replies.map((quick_reply) => (
                          <Space direction={'vertical'} className={styles.scriptItem} key={quick_reply.id}>
                            <Space direction={'horizontal'} className={styles.scriptTitleBar}>
                                <span style={{width: 200}} className={styles.sendButtonWrap}>
                                  <Button
                                    // 发送一组话术
                                    onClick={async () => {
                                      await BatchSendQuickReply(quick_reply.reply_details)
                                    }}
                                    type={'link'}
                                    className={styles.sendButton}
                                    icon={getIcon('icon-fasong')}
                                  />
                                </span>
                              <span className={styles.title}>
                                  {quick_reply.name}
                                </span>
                            </Space>
                            <Space direction={'vertical'} className={styles.replyDetailList}>
                              {quick_reply?.reply_details && quick_reply?.reply_details?.length > 0 && quick_reply.reply_details.map((reply_detail) => (
                                <Space direction={'horizontal'} className={styles.replyDetailItem}
                                       key={reply_detail.id}>
                                  <div className={styles.sendButtonWrap}>
                                    <Button
                                      // 发送单一话术
                                      type={'link'}
                                      onClick={async () => {
                                        await SendQuickReply(reply_detail)
                                      }}
                                      className={styles.sendButton}
                                      icon={getIcon('icon-fasong')}/>
                                  </div>
                                  <div>
                                    {
                                      reply_detail.content_type === 2 && (
                                        <ExpandableParagraph
                                          rows={3}
                                          content={reply_detail.quick_reply_content.text.content}
                                        />
                                      )
                                    }
                                    {
                                      reply_detail.content_type === 3 &&
                                      <div key={reply_detail.id} className={styles.replyPreviewItem}>
                                        <div className={styles.leftPart}>
                                          <Image src={reply_detail.quick_reply_content?.image?.picurl} fallback={fileIconImage}
                                          />
                                        </div>
                                        <div className={styles.rightPart}>
                                          <p>{reply_detail.quick_reply_content?.image?.title}</p>
                                          <p>{humanFileSize(reply_detail?.quick_reply_content?.image?.size)}</p>
                                        </div>
                                      </div>
                                    }
                                    {
                                      reply_detail.content_type === 4 && <div className={styles.replyPreviewItem}>
                                        <div className={styles.leftPart}>
                                          <Image src={reply_detail.quick_reply_content?.link?.picurl} preview={false} fallback={fileIconImage}
                                          />
                                        </div>
                                        <div className={styles.rightPart}>
                                          <p>{reply_detail.quick_reply_content?.link?.title}</p>
                                          <p>{reply_detail.quick_reply_content?.link?.desc}</p>
                                        </div>
                                      </div>
                                    }
                                    {
                                      reply_detail.content_type === 5 && <div className={styles.replyPreviewItem}>
                                        <div className={styles.leftPart}>
                                          <Image src={pdfImage} preview={false}/>
                                        </div>
                                        <div className={styles.rightPart}>
                                          <p>{reply_detail.quick_reply_content?.pdf?.title}</p>
                                          <p>{humanFileSize(reply_detail.quick_reply_content?.pdf?.size)}</p>
                                        </div>
                                      </div>
                                    }
                                    {
                                      reply_detail.content_type === 6 && <div className={styles.replyPreviewItem}>
                                        <div className={styles.leftPart}>
                                          <video src={reply_detail.quick_reply_content?.video?.picurl}/>
                                        </div>
                                        <div className={styles.rightPart}>
                                          <p>{reply_detail.quick_reply_content?.video?.title}</p>
                                          <p>{humanFileSize(reply_detail.quick_reply_content?.video?.size)}</p>
                                        </div>
                                      </div>
                                    }
                                  </div>
                                </Space>
                              ))}
                            </Space>
                          </Space>
                        ))}
                      </div>
                    )}
                  </Collapse.Panel>
                ))}

              </Collapse>
            )}
          </div>

        </ProCard.TabPane>
        <ProCard.TabPane key="staff" tab="个人话术" disabled={true}>
        </ProCard.TabPane>
      </ProCard>

      <BottomNavBar links={[
        {
          title: '话术',
          url: '/staff-frontend/script-library',
          icon: 'icon-message-success',
        },
        {
          title: '素材',
          url: '/staff-frontend/material-library',
          icon: 'icon-sucai-outline',
        },
        {
          title: '雷达',
          url: '/staff-frontend/radar',
          icon: 'icon-leida',
          disabled: true,
        },
      ]}/>

      <ModalForm
        width={400}
        className={'dialog'}
        layout={'horizontal'}
        visible={createModalVisible}
        onVisibleChange={setCreateModalVisible}
        // onFinish={async (params) =>
        //   HandleRequest({...currentGroup, ...params}, CreateGroup, () => {
        //     setGroupItemsTimestamp(Date.now);
        //   })
        // }
      >
        <h2 className='dialog-title'> 新建分组 </h2>
        <ProFormText
          name='name'
          label='分组名称'
          tooltip='最长为 24 个汉字'
          placeholder='请输入分组名称'
          rules={[
            {
              required: true,
              message: '请填写分组名称',
            },
          ]}
        />
      </ModalForm>

    </div>
  );
};

export default ScriptLibraryList;
