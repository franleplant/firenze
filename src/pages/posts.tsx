import { NextPage } from "next";
import Post from "components/Post";
import { List, Avatar, Space } from "antd";
import { MessageOutlined, LikeOutlined, StarOutlined } from "@ant-design/icons";
import React, { FC } from "react";

const postsList = [
  { user: "User A", title: "Title 1 title", content: "First Conent testing " },
  {
    user: "User B",
    title: "Title 2 title",
    content:
      "Testing long content Inner card: It can be placed inside the ordinary card to display the information of the multilevel structure.",
  },
  { user: "User C", title: "Title 3", content: "Asd" },
  { user: "User A", title: "Title 4", content: "asd asd ad asd " },
  { user: "User B", title: "Title 5", content: " adasd ad asd asd ad asd" },
  { user: "User A", title: "Title 4", content: "asd asd ad asd " },
  { user: "User B", title: "Title 5", content: " adasd ad asd asd ad asd" },
  { user: "User A", title: "Title 4", content: "asd asd ad asd " },
  { user: "User B", title: "Title 5", content: " adasd ad asd asd ad asd" },
  { user: "User A", title: "Title 4", content: "asd asd ad asd " },
  { user: "User B", title: "Title 5", content: " adasd ad asd asd ad asd" },
];

const posts: NextPage = () => {
  return (
    <>
      <List
        itemLayout="vertical"
        size="large"
        dataSource={postsList}
        renderItem={(item) => (
          <Post item={item} />
          // <List.Item
          // 	actions={[
          // 		<IconText icon={StarOutlined} text='156' key='list-vertical-star-o' />,
          // 		<IconText icon={LikeOutlined} text='156' key='list-vertical-like-o' />,
          // 		<IconText icon={MessageOutlined} text='2' key='list-vertical-message' />,
          // 	]}>
          // 	<List.Item.Meta
          // 		avatar={<Avatar src='https://joeschmoe.io/api/v1/random' />}
          // 		title={<a href='https://ant.design'>{item.title}</a>}
          // 		description={item.content}
          // 	/>
          // </List.Item>
        )}
      />
    </>
  );
};

export default posts;
