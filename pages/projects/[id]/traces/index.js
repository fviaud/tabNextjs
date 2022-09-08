import React from 'react'
import { useRouter } from 'next/router'
import Menu from "components/menu"

function index({ params }) {
    const { id } = params
    return (
        <Menu id={id}>traces</Menu>
    )
}

export function getServerSideProps(context) {
    return { props: { params: context.params } }
}

export default index