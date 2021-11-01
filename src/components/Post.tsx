import React, { FC, ReactElement } from "react";
import { List, Space, Avatar, Button } from "antd";
import { MessageOutlined, LikeOutlined, StarOutlined } from "@ant-design/icons";

const IconText = ({ icon, text }: { icon: ReactElement; text: string }) => (
  <Space>
    {/* Type link only for styling  */}
    <Button type="link" onClick={() => alert("Clicked")}>
      {icon}
    </Button>
    {text}
  </Space>
);

interface IProps {
  item: { title: string; user: string; content: string };
}

const Post = (props: IProps) => {
  return (
    <List.Item
      actions={[
        <IconText
          icon={<StarOutlined />}
          text="156"
          key="list-vertical-star-o"
        />,
        <IconText
          icon={<LikeOutlined />}
          text="156"
          key="list-vertical-like-o"
        />,
        <IconText
          icon={<MessageOutlined />}
          text="2"
          key="list-vertical-message"
        />,
      ]}
    >
      <List.Item.Meta
        avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
        title={<a href="https://ant.design">{props.item.title}</a>}
        description={props.item.content}
      />
    </List.Item>
  );
};

export default Post;
