import React from "react";
import FList from 'comps/FList'

function NewArticle () {
	return (
		<FList title='最近' style={{ marginBottom: 16 }}  path='article.near' />
	)
}
export default NewArticle