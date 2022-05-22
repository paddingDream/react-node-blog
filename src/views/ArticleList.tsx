import React, {CSSProperties, useState} from "react";
import useRequest, {request} from "hooks/useRequest";
import FLoading from "comps/FLoading";
import FEmpty from "comps/FEmpty";
import {Col, message, Pagination, Row} from "antd";
import {
    DeleteOutlined, EditOutlined,
    ReadOutlined} from '@ant-design/icons';
import {useNavigate} from "react-router-dom";
import {getLogin, parseHTML} from "tools/tools";

type ListItem = { content: string, id: number, refresh?: () => void }

type List = Array<ListItem>

const ArticleItem = ({content, id, refresh = () => {} }: ListItem ) => {
    const wrapperStyle: CSSProperties = {
        display: "flex",
        justifyContent: "space-between",
        lineHeight: '50px',
        height: 50
    }

    const contentStyle: CSSProperties = {
        width: "100%",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
    }

    const toolbarStyle: CSSProperties = {
        width: 150,
        marginLeft: 10,
        textAlign: "right",
        cursor: "pointer",
        fontSize: "16px"
    }

    const navigate = useNavigate()
    const delArticle = async () => {
        await request({
            url: "/execute",
            data: {
                path: 'article.delArticle',
                articleID: id
            }
        })
        refresh()
        await message.success('删除成功！')
    }
    const editArticle = () => {
        navigate('/write', { state: { articleID: id }, replace: false })
    }
    return (<div className='hover-blue fxs-height-30'
                 style={wrapperStyle}>
        <div style={contentStyle}>
            {parseHTML(content)}
        </div>
        <div style={toolbarStyle}>
            <ReadOutlined onClick={() => {
                navigate('/detail', { state: { articleID: id }, replace: false })
            }} />
            { getLogin() ? <EditOutlined style={{marginLeft: 20}} onClick={ editArticle } /> : null }
            { getLogin() ? <DeleteOutlined style={{marginLeft: 20}} onClick={ delArticle } /> : null }
        </div>
    </div>)
}

function ArticleList() {
    const [ currentPage, setCurrentPage ] = useState(1)
    const pageSize = 10
    const [ params, setParams ] = useState({
        url: '/pageQuery2',
        data: {
            path: 'article.list',
            pageSize: pageSize,
            pageNo: currentPage,
            isAll: true
        }
    })
    let {empty, loading, resData, setLoading, refresh} = useRequest(params)
    const list: List = resData.list
    const handleChange = (page:number, pageSize:number) => {
        setLoading(true)
        setCurrentPage(page)
        setParams({
            ...params,
            data: {
                ...params.data,
                pageSize: pageSize,
                pageNo: page
            }
        })
    }

    return (
        <Row>
            <Col xs={{span: 1}} lg={{span: 2}} xxl={{span: 6}}/>
            <Col xs={{span: 22}} lg={{span: 20}} xxl={{span: 12}}>
                <div style={{minHeight: 500}} className='fxs-min-height-300'>
                    <FLoading show={loading}/>
                    {
                        list.map((ele, index) => <ArticleItem key={index} {...ele} refresh={refresh} />)
                    }
                    <FEmpty show={empty}/>
                </div>
                <Pagination
                    simple
                    defaultCurrent={ currentPage }
                    defaultPageSize={ pageSize }
                    current={ currentPage }
                    onChange={ handleChange }
                    style={{ marginTop: 60, textAlign: "center" }}
                    total={resData.total}
                    showSizeChanger
                    pageSizeOptions={[ 10, 20, 30, 40, 50 ]}
                    showQuickJumper
                />
            </Col>
            <Col xs={{span: 1}} lg={{span: 2}} xxl={{span: 6}}/>
        </Row>
    )
}

export default ArticleList
