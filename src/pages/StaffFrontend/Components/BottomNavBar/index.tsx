import React, {ReactNode} from 'react';
import styles from "./index.less";
import {Button, Col, Divider, Row} from "antd";
import Icon, {createFromIconfontCN} from "@ant-design/icons";
import defaultSettings from "../../../../../config/defaultSettings";
import {isImg, isUrl} from "@/utils/utils";
import {history} from "umi";

export type NavBarLink = {
  title: string,
  url: string,
  className?: string,
  icon: ReactNode | string,
  disabled?: boolean,
}

export type BottomNavBarProps = {
  links: NavBarLink[]
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

const BottomNavBar: React.FC<BottomNavBarProps> = (props) => {
  const {links} = props;
  return (
    <div className={styles.bottomNavbar}>
      <Row className={styles.navList}>
        {links.map((link, index) => {
          const isActive = window.location.href.includes(link.url);
          const id = link.url + link.title;
          const span = Math.floor((24 / links.length));
          return (
            <Col key={id} className={styles.navItem} span={span}>
              <Button
                type={'link'}
                onClick={() => {
                  if (!isActive) {
                    history.push(link.url)
                  }
                }}
                icon={getIcon(link.icon)}
                block={true}
                disabled={link.disabled || false}
                className={(link.disabled ? 'disabled' : '') + (isActive ? ' active' : '')}
              >{link.title}</Button>
              {index < links.length - 1 && (
                <Divider type={'vertical'}/>
              )}
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default BottomNavBar;
