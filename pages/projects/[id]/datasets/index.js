import React from 'react'
import Menu from "components/menu"

function index({ params }) {
    const { id } = params
    return (
        <Menu id={id}>datasets</Menu>
    )
}

export function getServerSideProps(context) {
    return { props: { params: context.params } }
}

export default index