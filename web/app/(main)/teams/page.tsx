'use client'

import { useState } from 'react'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table'
import { PencilIcon, PlusIcon, SearchIcon } from 'lucide-react'
import { DynamicIcon } from 'lucide-react/dynamic'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { type Team } from '@/stores/team-list.store'
import {
  useTeamTableHook,
  PAGE_SIZE_OPTIONS,
  type PageSizeOption,
} from '@/components/layouts/team/use-team-table.hook'
import TeamCreateModal from '@/components/layouts/team/team-create-modal'
import { TeamEditModal } from '@/components/layouts/team/team-edit-modal'

// ─── Team avatar ───────────────────────────────────────────────────────────────

function TeamAvatar({ team }: { team: Team }) {
  return (
    <div
      className="flex size-8 shrink-0 items-center justify-center rounded-lg text-white"
      style={{ backgroundColor: team.color }}
    >
      {team.logo ? (
        <DynamicIcon name={team.logo} className="size-4" />
      ) : (
        <span className="text-xs font-semibold leading-none">
          {team.name.charAt(0).toUpperCase()}
        </span>
      )}
    </div>
  )
}

// ─── Pagination helper ─────────────────────────────────────────────────────────

function buildPageNumbers(current: number, total: number): (number | '...')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const pages: (number | '...')[] = [1]

  if (current > 3) pages.push('...')

  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  for (let i = start; i <= end; i++) pages.push(i)

  if (current < total - 2) pages.push('...')

  pages.push(total)
  return pages
}

// ─── Columns ──────────────────────────────────────────────────────────────────

interface BuildColumnsProps {
  onEdit: (team: Team) => void
}

function buildColumns({ onEdit }: BuildColumnsProps): ColumnDef<Team>[] {
  return [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row, getValue }) => (
        <div className="flex items-center justify-start gap-2">
          <TeamAvatar team={row.original} />
          <span className="font-medium">{getValue<string>()}</span>
        </div>
      ),
    },
    {
      id: 'actions',
      header: '',
      size: 48,
      cell: ({ row }) => (
        <div className="flex justify-end">
          <Button
            size="icon"
            variant="ghost"
            className="size-8"
            onClick={() => onEdit(row.original)}
          >
            <PencilIcon className="size-4" />
          </Button>
        </div>
      ),
    },
  ]
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const TeamPage = () => {
  const {
    teams,
    total,
    page,
    totalPages,
    pageSize,
    search,
    loading,
    setSearch,
    setPageSize,
    goToPage,
    refresh,
  } = useTeamTableHook()

  const [createOpen, setCreateOpen] = useState(false)
  const [editTeam, setEditTeam] = useState<Team | null>(null)

  const columns = buildColumns({
    onEdit: setEditTeam,
  })

  const table = useReactTable({
    data: teams,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const from = total === 0 ? 0 : (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)
  const pageNumbers = buildPageNumbers(page, totalPages)

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Teams</h1>
          <p className="text-sm text-muted-foreground">Manage your teams</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative max-w-xs">
            <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search teams..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button onClick={() => setCreateOpen(true)}>
            <PlusIcon className="size-4" />
            New team
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    style={{ width: header.column.columnDef.size }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-32">
                  <div className="flex justify-center">
                    <Spinner />
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center text-muted-foreground"
                >
                  {search ? `No teams matching "${search}".` : 'No teams yet.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer: row count + page size + pagination */}
      {!loading && total > 0 && (
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <p className="text-sm text-muted-foreground">
              {from}–{to} of {total} team{total !== 1 ? 's' : ''}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Rows</span>
              <Select
                value={String(pageSize)}
                onValueChange={(v) => setPageSize(Number(v) as PageSizeOption)}
              >
                <SelectTrigger className="h-8 w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAGE_SIZE_OPTIONS.map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {totalPages > 1 && (
            <Pagination className="mx-0 w-auto justify-end">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={(e) => {
                      e.preventDefault()
                      if (page > 1) goToPage(page - 1)
                    }}
                    className={
                      page === 1
                        ? 'pointer-events-none opacity-50'
                        : 'cursor-pointer'
                    }
                  />
                </PaginationItem>

                {pageNumbers.map((p, i) =>
                  p === '...' ? (
                    <PaginationItem key={`ellipsis-${i}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={p}>
                      <PaginationLink
                        isActive={p === page}
                        onClick={(e) => {
                          e.preventDefault()
                          goToPage(p)
                        }}
                        className="cursor-pointer"
                      >
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  ),
                )}

                <PaginationItem>
                  <PaginationNext
                    onClick={(e) => {
                      e.preventDefault()
                      if (page < totalPages) goToPage(page + 1)
                    }}
                    className={
                      page === totalPages
                        ? 'pointer-events-none opacity-50'
                        : 'cursor-pointer'
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      )}

      {/* Dialogs */}
      <TeamCreateModal
        open={createOpen}
        onClose={() => {
          setCreateOpen(false)
          refresh()
        }}
      />
      <TeamEditModal
        team={editTeam}
        onClose={() => {
          setEditTeam(null)
          refresh()
        }}
      />
    </div>
  )
}

export default TeamPage
