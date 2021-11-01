import { FC } from "react";
import { Layout, PageHeader } from "antd";
import LeftSideNav from "./LeftSideNav";
import RightSideNav from "./RightSideNav";

const { Header, Content, Footer } = Layout;

const LayoutComponent: FC = ({ children }) => {
  return (
    <Layout>
      <LeftSideNav />
      <Layout
        className="site-layout"
        style={{ marginLeft: 200, marginRight: 200 }}
      >
        <Header className="site-layout-background" style={{ padding: 0 }}>
          <PageHeader
            className="site-page-header"
            onBack={() => null}
            title="Title"
            subTitle="This is a subtitle"
          />
        </Header>
        <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
          <div
            className="site-layout-background"
            style={{ padding: 24, textAlign: "center" }}
          >
            {children}
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Ant Design ©2018 Created by Ant UED
        </Footer>
      </Layout>
      <RightSideNav />
    </Layout>
  );
};

export default LayoutComponent;
