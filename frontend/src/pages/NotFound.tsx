import { Card, Container, Typography } from '@mui/material'
import { Link } from 'react-router'

import { Button } from '../components/Button'
import { glassCardSx } from '../theme/sx'

export function NotFound() {
  return (
    <Container maxWidth="md" component="section" sx={{ py: 10, textAlign: 'center' }}>
      <Card sx={{ ...glassCardSx, p: 4 }}>
        <Typography sx={{ color: 'var(--color-accent)', fontSize: '0.875rem', fontWeight: 700 }}>404</Typography>
        <Typography component="h1" sx={{ mt: 1, color: 'var(--color-text)', fontSize: '1.875rem', fontWeight: 800 }}>Página não encontrada</Typography>
        <Typography sx={{ mt: 1.5, color: 'var(--color-muted)' }}>A rota solicitada não existe neste frontend.</Typography>
        <Button sx={{ mt: 3 }}><Link to="/">Voltar para home</Link></Button>
      </Card>
    </Container>
  )
}
