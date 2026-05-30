import { Box, Card, Skeleton, Stack } from "@mui/material";

import { glassCardSx } from "../theme/sx";

export function ProductSkeleton() {
  return (
    <Card
      sx={{
        ...glassCardSx,
        overflow: "hidden",
      }}
    >
      <Skeleton
        variant="rectangular"
        animation="wave"
        sx={{
          height: 0,
          pt: "75%",
          bgcolor: "var(--color-surface-muted)",
          transform: "none",
        }}
      />
      <Stack spacing={2} sx={{ p: 2 }}>
        <Stack
          spacing={2}
          sx={{
            direction: "row",
            justifyContent: "space-between",
          }}
        >
          <Skeleton
            animation="wave"
            width={96}
            height={16}
            sx={{ bgcolor: "var(--color-surface-muted)" }}
          />
          <Skeleton
            animation="wave"
            variant="rounded"
            width={52}
            height={24}
            sx={{ bgcolor: "var(--color-surface-muted)" }}
          />
        </Stack>
        <Box>
          <Skeleton
            animation="wave"
            width="100%"
            height={24}
            sx={{ bgcolor: "var(--color-surface-muted)" }}
          />
          <Skeleton
            animation="wave"
            width="72%"
            height={24}
            sx={{ bgcolor: "var(--color-surface-muted)" }}
          />
        </Box>
        <Stack
          sx={{
            direction: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          spacing={2}
        >
          <Box sx={{ flex: 1 }}>
            <Skeleton
              animation="wave"
              width={120}
              height={28}
              sx={{ bgcolor: "var(--color-surface-muted)" }}
            />
            <Skeleton
              animation="wave"
              width={72}
              height={14}
              sx={{ bgcolor: "var(--color-surface-muted)" }}
            />
          </Box>
          <Skeleton
            animation="wave"
            variant="rounded"
            width={54}
            height={24}
            sx={{ bgcolor: "var(--color-surface-muted)" }}
          />
        </Stack>
        <Skeleton
          animation="wave"
          variant="rounded"
          height={44}
          sx={{ bgcolor: "var(--color-surface-muted)" }}
        />
      </Stack>
    </Card>
  );
}
