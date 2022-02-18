import { useGetBountyWorksCountQuery, useGetBountyWorksQuery } from '@/bounty/queries'
import { asBountyWork } from '@/bounty/types/casts'
import { WorkSubmittedEventOrderByInput } from '@/common/api/queries'
import { usePagination } from '@/common/hooks/usePagination'

interface Props {
  bountyId: string
  perPage?: number
  workerHandle: string
}

export const useBountyWorks = ({ bountyId, perPage = 4, workerHandle }: Props) => {
  const { data: dataCount } = useGetBountyWorksCountQuery({
    variables: {
      where: {
        entry: {
          bounty: {
            id_eq: bountyId,
          },
        },
      },
    },
  })

  const { offset, pagination } = usePagination(perPage, dataCount?.workSubmittedEventsConnection.totalCount ?? 0, [
    perPage,
  ])

  const { data, loading } = useGetBountyWorksQuery({
    variables: {
      offset,
      limit: perPage,
      order: WorkSubmittedEventOrderByInput.CreatedAtDesc,
      where: {
        entry: {
          bounty: {
            id_eq: bountyId,
          },
          worker: {
            handle_startsWith: workerHandle,
          },
        },
      },
    },
  })

  return {
    isLoading: loading,
    works: data?.workSubmittedEvents.map(asBountyWork) ?? [],
    pagination,
  }
}