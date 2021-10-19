import React, {useEffect, useState} from 'react';
import ProCard from "@ant-design/pro-card";
import BottomNavBar from "@/pages/StaffFrontend/Components/BottomNavBar";
import styles from "./index.less";
import {message} from 'antd';
import {CommonItemsResp} from "@/services/common";
import {
  MaterialLibraryItem,
  MaterialLibraryTag,
  QueryMaterialLibrary, QueryMaterialLibraryTag
} from "@/pages/StaffFrontend/MaterialLibrary/service";
import MaterialListCard from "@/pages/StaffFrontend/MaterialLibrary/components/MaterialListCard";

const MaterialLibraryList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<MaterialLibraryItem[]>([]);
  const [keyword, setKeyword] = useState<string>("");
  const [materialType, setMaterialType] = useState<string>("");
  const [allTags, setAllTags] = useState<MaterialLibraryTag[]>([]);
  const [selectedTags, setSelectedTags] = useState<MaterialLibraryTag[]>([]);

  useEffect(() => {
    setLoading(true);
    QueryMaterialLibraryTag({
      page_size: 5000,
    }).then((res: CommonItemsResp<MaterialLibraryTag>) => {
      setLoading(false);
      if (res.code !== 0) {
        message.error("获取素材标签列表失败");
        return
      }

      setAllTags(res.data.items || [])
    })
  }, [])

  useEffect(() => {
    setLoading(true);
    QueryMaterialLibrary({
      page_size: 5000,
      title: keyword,
      material_type: materialType,
      material_tag_list: selectedTags.map((tag) => tag.id),
    }).then((res: CommonItemsResp<MaterialLibraryItem>) => {
      setLoading(false);
      if (res.code !== 0) {
        message.error("获取素材列表失败");
        return
      }

      setItems(res.data.items || [])
    })
  }, [keyword, materialType, selectedTags])

  return (
    <>
      <div className={styles.materialLibraryContainer}>
        <ProCard
          tabs={{
            type: 'line',
            onChange: (currentKey) => {
              if (currentKey === "all") {
                setMaterialType("")
              } else {
                setMaterialType(currentKey)
              }
            }
          }}

        >
          <ProCard.TabPane key="all" tab="全部">
            <MaterialListCard allTags={allTags} setSelectedTags={setSelectedTags} type={'all'} loading={loading}
                              setKeyword={setKeyword} items={items}/>
          </ProCard.TabPane>
          <ProCard.TabPane key="link" tab="链接">
            <MaterialListCard allTags={allTags} setSelectedTags={setSelectedTags} type={'link'} loading={loading}
                              setKeyword={setKeyword} items={items}/>
          </ProCard.TabPane>
          <ProCard.TabPane key="pdf" tab="PDF">
            <MaterialListCard allTags={allTags} setSelectedTags={setSelectedTags} type={'pdf'} loading={loading}
                              setKeyword={setKeyword} items={items}/>
          </ProCard.TabPane>
          <ProCard.TabPane key="video" tab="视频">
            <MaterialListCard allTags={allTags} setSelectedTags={setSelectedTags} type={'video'} loading={loading}
                              setKeyword={setKeyword} items={items}/>
          </ProCard.TabPane>
          <ProCard.TabPane key="poster" tab="海报">
            <MaterialListCard allTags={allTags} setSelectedTags={setSelectedTags} type={'poster'} loading={loading}
                              setKeyword={setKeyword} items={items}/>
          </ProCard.TabPane>
          <ProCard.TabPane key="ppt" tab="PPT">
            <MaterialListCard allTags={allTags} setSelectedTags={setSelectedTags} type={'ppt'} loading={loading}
                              setKeyword={setKeyword} items={items}/>
          </ProCard.TabPane>
          <ProCard.TabPane key="excel" tab="表格">
            <MaterialListCard allTags={allTags} setSelectedTags={setSelectedTags} type={'excel'} loading={loading}
                              setKeyword={setKeyword} items={items}/>
          </ProCard.TabPane>
          <ProCard.TabPane key="word" tab="文档">
            <MaterialListCard allTags={allTags} setSelectedTags={setSelectedTags} type={'word'} loading={loading}
                              setKeyword={setKeyword} items={items}/>
          </ProCard.TabPane>
        </ProCard>

        <div style={{height: 36}}/>
      </div>

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

    </>
  );
};

export default MaterialLibraryList;
