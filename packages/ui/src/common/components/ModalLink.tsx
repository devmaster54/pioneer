import React from 'react'
import { ReactNode } from 'react-markdown'

import { useModal } from '../hooks/useModal'
import { AnyModalCall } from '../providers/modal/types'

import { Link } from './Link'

interface ModalLinkProps<Call> {
  call: Call extends AnyModalCall ? Call : never
  children: ReactNode
}

export const ModalLink = ({ call, children }: ModalLinkProps<AnyModalCall>) => {
  const { showModal } = useModal()
  return (
    <Link
      onClick={(evt) => {
        evt.preventDefault()
        showModal(call)
      }}
    >
      {children}
    </Link>
  )
}

export type IModalLink<Call> = React.FC<ModalLinkProps<Call>>