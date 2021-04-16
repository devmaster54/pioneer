import React, { ReactNode } from 'react'
import styled from 'styled-components'

import { PageContent } from '../../common/components/page/PageContent'
import { Breadcrumbs } from '../../common/components/page/Sidebar/Breadcrumbs/Breadcrumbs'

interface AppPageProps {
  crumbs: { href: string; text: string }[]
  children: ReactNode
}

export const AppPage = ({ children, crumbs }: AppPageProps) => (
  <PageContent>
    <Breadcrumbs crumbs={crumbs} />
    <PageContainer>{children}</PageContainer>
  </PageContent>
)

export const PageContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto;
  grid-row-gap: 24px;
  width: 100%;
`