import * as React from "react"
import { useRouter } from "next/router"
import Box from "@mui/material/Box"
import Tabs from "@mui/material/Tabs"
import Tab from "@mui/material/Tab"

import Link from "next/link"
import { Stack } from "@mui/system"

function LinkTab(props) {
  return (
    <Link href={props.href}>
      <Tab component="a" {...props} />
    </Link>
  )
}

export default function NavTabs({ children, id }) {
  const router = useRouter()
  const items = [
    { name: "traces", path: `/projects/${id}/traces` },
    { name: "datasets", path: `/projects/${id}/datasets` },
    { name: "jobs", path: `/projects/${id}/jobs` },
  ]

  const [value, setValue] = React.useState(items.findIndex((item) => item.path === router.asPath) || 0)
  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <Stack>
      <Box sx={{ width: "100%" }}>
        <Tabs value={value} onChange={handleChange} aria-label="nav tabs example">
          {items.map((item, index) => (
            <LinkTab key={index} label={item.name} href={item.path} />
          ))}
        </Tabs>
      </Box>
      <main>{children}</main>
    </Stack>
  )
}
