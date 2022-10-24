export default async function handler(req, res) {
  const { provider } = req.query
  const PROVIDER = provider.toUpperCase()

  const data = await fetch(process.env[`${PROVIDER}_CONF_URI`]).then((response) => response.json())
  const CLIENT_ID = process.env[`${PROVIDER}_CLIENT_ID`]
  const REDIRECT_URI = process.env[`${PROVIDER}_REDIRECT_URI`]

  const url = `${data.authorization_endpoint}?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=email`

  res.redirect(307, url).end()
}
