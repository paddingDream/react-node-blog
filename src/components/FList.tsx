import React, {CSSProperties, useState} from "react";
import {List} from "antd"
import FLoading from "comps/FLoading";
import useRequest from "hooks/useRequest";
import {useNavigate} from "react-router-dom";
import {parseHTML} from "tools/tools";

export type ListItem = { title: string, content: string, id: number }

export type List = Array<ListItem>

export type ListParams = {
    path: string
    style?: CSSProperties
    title: string
}

function ListItem({title, id}: ListItem) {
    const navigate = useNavigate()
    const itemStyle: CSSProperties = {
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        overflow: "hidden",
        display: "block",
        cursor: "pointer",
    }
    return (<List.Item style={itemStyle} className="hover-blue" onClick={() => {
        navigate('/detail', { state: { articleID: id }, replace: false })
    }}>
        { parseHTML(title) }
    </List.Item>)
}

const Header = ({title}: { title: string }) => {
    const sty: CSSProperties = {fontSize: "16px", fontWeight: "bold"}
    return (<div style={sty}>{title}</div>)
}

function FList({path, title, style}: ListParams) {
    const [ params ] = useState({
        data: {
            path: path
        }
    })
    let {loading, resData} = useRequest(params)
    const list: List = resData.list
    const wrapperStyle: CSSProperties = {position: "relative", minHeight: "200px"}
    return (
        <div style={wrapperStyle}>
            <FLoading show={loading}/>
            <List
                className={"card-box-shadow"}
                style={style}
                header={<Header title={title}/>}
                bordered
                dataSource={list}
                renderItem={item => <ListItem {...item} />}
            />
        </div>
    )
}

export default FList
