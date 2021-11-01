import { Layout, Menu } from "antd";
import {
  AppstoreOutlined,
  BarChartOutlined,
  CloudOutlined,
  ShopOutlined,
  TeamOutlined,
  UserOutlined,
  UploadOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { FC, ReactElement } from "react";

interface INav {
  title: string;
  icon: ReactElement;
}

const { Sider } = Layout;
const navigationItems: INav[] = [
  { title: "nav 1", icon: <UserOutlined /> },
  { title: "nav 2", icon: <VideoCameraOutlined /> },
  { title: "nav 3", icon: <UploadOutlined /> },
  { title: "nav 4", icon: <BarChartOutlined /> },
  { title: "nav 5", icon: <CloudOutlined /> },
  { title: "nav 6", icon: <AppstoreOutlined /> },
  { title: "nav 7", icon: <TeamOutlined /> },
  { title: "nav 8", icon: <ShopOutlined /> },
];
const RightSideNav: FC = () => {
  return (
    <Sider
      style={{
        overflow: "auto",
        height: "100vh",
        position: "fixed",
        right: 0,
      }}
    >
      <div className="logo" />
      <Menu theme="dark" mode="inline" defaultSelectedKeys={["4"]}>
        {navigationItems.map(({ title, icon }, index) => (
          <Menu.Item key={index} icon={icon}>
            {title}
          </Menu.Item>
        ))}
      </Menu>
    </Sider>
  );
};

export default RightSideNav;
