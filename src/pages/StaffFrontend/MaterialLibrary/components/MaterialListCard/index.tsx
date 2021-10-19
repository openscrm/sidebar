import {Button, Dropdown, Empty, Form, Image, Input, message, Space, Tag} from 'antd';
import React, {Dispatch, useEffect, useState} from 'react';
import styles from "./index.less";
import fileIconPDF from "@/assets/file-icon-pdf.svg";
import fileIconPPT from "@/assets/file-icon-ppt.svg";
import fileIconWord from "@/assets/file-icon-word.svg";
import fileIconExcel from "@/assets/file-icon-excel.svg";
import fileIconLink from "@/assets/file-icon-link.svg";
import fileIconImage from "@/assets/file-icon-image.svg";
import fileIconVideo from "@/assets/file-icon-video.svg";
import {MaterialLibraryItem, MaterialLibraryTag, MaterialType} from "@/pages/StaffFrontend/MaterialLibrary/service";
import Icon, {ClearOutlined, CloseOutlined, createFromIconfontCN, EyeOutlined} from "@ant-design/icons";
import defaultSettings from "../../../../../../config/defaultSettings";
import {isImg, isUrl} from "@/utils/utils";
import {CommonResp, UploadMedia, UploadMediaResult} from "@/services/common";

export type MaterialListProps = {
  type: MaterialType | 'all';
  setKeyword: Dispatch<string>;
  loading: boolean;
  items: MaterialLibraryItem[];
  allTags: MaterialLibraryTag[];
  setSelectedTags?: Dispatch<MaterialLibraryTag[]>;
}

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

const calFileIcon = (item: MaterialLibraryItem) => {
  if (item.material_type === 'pdf') {
    return fileIconPDF
  }
  if (item.material_type === 'ppt') {
    return fileIconPPT
  }
  if (item.material_type === 'excel') {
    return fileIconExcel
  }
  if (item.material_type === 'word') {
    return fileIconWord
  }
  if (item.material_type === 'poster') {
    return item.url
  }
  if (item.material_type === 'video') {
    return fileIconVideo
  }
  // if (item.url) {
  //   return item.url
  // }

  return fileIconLink
}


const SendMaterial = async (item: MaterialLibraryItem) => {
  let media_id = "";
  let msg_type: string = item.material_type || "";
  if (["poster"].includes(msg_type)) {
    msg_type = "image";
  }
  if (["link", "poster"].includes(msg_type)) {
    msg_type = "news";
  }
  if (["pdf", "excel", "ppt", "word"].includes(msg_type)) {
    msg_type = "file";
  }
  if (["image", 'file', 'video'].includes(msg_type)) {
    const hide = message.loading("素材准备中");
    // @ts-ignore
    const res = await UploadMedia(msg_type, item.url) as CommonResp<UploadMediaResult>;
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
        link: item.link, // H5消息页面url 必填
        title: item.title, // H5消息标题
        desc: item.digest, // H5消息摘要
        imgUrl: item.url, // H5消息封面图片URL
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
    console.log("replyDetail", item);
    message.error(result.err_msg)
  })

}

const MaterialListCard: React.FC<MaterialListProps> = (props) => {
  const {setKeyword, loading, items, allTags} = props;
  const [filterVisible, setFilterVisible] = useState(false);
  const [tagKeyword, setTagKeyword] = useState("");
  const [filteredTags, setFilteredTags] = useState<MaterialLibraryTag[]>([])
  const [selectedTags, setSelectedTags] = useState<MaterialLibraryTag[]>([])

  useEffect(() => {
    setFilteredTags(allTags.filter((tag) => tag.name.includes(tagKeyword)))
  }, [tagKeyword, allTags])

  return <>
    <div className={styles.searchBar}>
      <Input.Search placeholder="输入关键词" loading={loading} style={{marginRight: 12}} allowClear onSearch={(value) => {
        setKeyword(value);
      }}/>
      <Dropdown
        visible={filterVisible}
        overlay={
          <div className={styles.overlay}>
            <div style={{padding: '0 8px'}}>
              <div className={styles.overlayTitle}>素材标签 ( {allTags.length} )</div>
              <Form
                layout={'horizontal'}
              >
                <Input
                  allowClear={true}
                  placeholder={'输入关键词搜索标签'}
                  value={tagKeyword}
                  onChange={(e) => {
                    setTagKeyword(e.currentTarget.value)
                  }}
                />
                <div style={{padding: "12px 0"}}>
                  {filteredTags?.map((tag) => {
                    const isSelected = selectedTags.map((selectedTag) => selectedTag.id)?.includes(tag?.id);
                    return (
                      <Space>
                        <Tag
                          style={{cursor: 'pointer'}}
                          className={`tag-item ${isSelected ? ' selected-tag-item' : ''}`}
                          key={tag.id}
                          onClick={() => {
                            if (tag?.id && isSelected) {
                              setSelectedTags(selectedTags.filter((selectedTag) => {
                                return selectedTag.id !== tag?.id
                              }))
                            } else {
                              setSelectedTags([...selectedTags, tag])
                            }
                          }}
                        >
                          {tag.name}
                          {isSelected && (
                            <CloseOutlined style={{marginLeft: 6, fontSize: 11}}/>
                          )}
                        </Tag>
                      </Space>
                    )
                  })}
                </div>
                {allTags?.length === 0 && <Empty style={{marginTop: 36, marginBottom: 36}}/>}
                <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                  <Button onClick={() => setFilterVisible(false)}>取消</Button>
                  <Button
                    style={{marginLeft: 6}}
                    type='primary'
                    htmlType="submit"
                    onClick={() => {
                      setFilterVisible(false)
                      if (props.setSelectedTags) {
                        props.setSelectedTags(selectedTags || [])
                      }
                    }}>完成</Button>
                </div>
              </Form>
            </div>
          </div>
        } trigger={['click']}>
        <div>
          <Button
            onClick={() => {
              setFilterVisible(!filterVisible)
            }}>筛选</Button>
        </div>
      </Dropdown>
    </div>

    {selectedTags.length > 0 && (
      <div className={styles.filterBar}>
        <div className={styles.tagList}>
          {selectedTags?.map((tag) => (
            <span
              key={tag.id}
              className={styles.tag}
              style={{cursor: 'pointer'}}
              onClick={() => {
                setSelectedTags(selectedTags.filter((item) => item.id !== tag.id))
              }}
            >
          {tag.name}
              <CloseOutlined style={{marginLeft: 6, fontSize: 11}}/>
        </span>
          ))}
        </div>
        {selectedTags.length > 0 && (
          <Button onClick={() => setSelectedTags([])} icon={<ClearOutlined/>} type={'link'}>清空筛选</Button>
        )}
      </div>
    )}

    <div>
      {items.length === 0 && (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>
      )}
      {items.length > 0 && (
        <Space direction={'vertical'} className={styles.materialList}>
          {items.map((item) => (
            <Space direction={'horizontal'} className={styles.materialItem} key={item.id}>
              <Space>
                 <span className={styles.sendButtonWrap}>
                  <Button
                    // 发送一组话术
                    onClick={async () => {
                      await SendMaterial(item);
                    }}
                    type={'link'}
                    className={styles.sendButton}
                    icon={getIcon('icon-fasong')}
                  />
                </span>
              </Space>
              <Space className={styles.materialPreview}>
                <div className={styles.leftPart}>
                  {item.material_type === 'poster' && (
                    <Image src={calFileIcon(item)} fallback={fileIconImage}
                           preview={item.material_type === 'poster' ? {mask: <EyeOutlined/>} : false}/>
                  )}
                  {item.material_type === 'link' && (
                    <Image style={{cursor: 'pointer'}} onClick={() => {
                      window.open(item.link)
                    }} src={calFileIcon(item)} fallback={fileIconImage}
                           preview={false}/>
                  )}
                  {["video", "pdf", "ppt", "excel", "word"].includes(item.material_type) && (
                    <Image style={{cursor: 'pointer'}} onClick={() => {
                      window.open(item.url)
                    }} src={calFileIcon(item)} fallback={fileIconImage}
                           preview={false}/>
                  )}
                </div>
                <div className={styles.rightPart}>
                  <div className={styles.title}>{item.title}</div>
                  <div className={styles.desc}>{item.digest}</div>
                  <div className={styles.tagList}>
                    {item?.tags?.map((tag) => (
                      <span key={tag.id} className={styles.tag}>{tag.name}</span>
                    ))}
                  </div>
                </div>
              </Space>
            </Space>
          ))}
        </Space>
      )}
    </div>
  </>
};

export default MaterialListCard;
