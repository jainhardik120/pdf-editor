'use client';

import { useCallback } from 'react';

import Link from 'next/link';

import { format } from 'date-fns';
import { Edit, MoreHorizontal, Plus, Trash2 } from 'lucide-react';
import { useQueryStates, parseAsInteger } from 'nuqs';
import { toast } from 'sonner';
import { z } from 'zod';

import MutationModal from '@/components/mutation-modal';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useInvalidateQuery, useTRPCMutation, useTRPCQuery } from '@/server/react';

const MAX_NAME_LENGTH = 255;

const createPdfSchema = z.object({
  name: z.string().min(1, 'Name is required').max(MAX_NAME_LENGTH),
});

const updatePdfSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Name is required').max(MAX_NAME_LENGTH),
});

type PdfListTableProps = {
  initialPage: number;
  initialLimit: number;
};

export const PdfListTable = ({ initialPage, initialLimit }: PdfListTableProps) => {
  const [{ page, limit }, setParams] = useQueryStates({
    page: parseAsInteger.withDefault(initialPage),
    limit: parseAsInteger.withDefault(initialLimit),
  });

  const invalidateQuery = useInvalidateQuery();

  const { data, isLoading, error } = useTRPCQuery((trpc) =>
    trpc.pdfs.list.queryOptions({ page, limit }),
  );

  const createMutation = useTRPCMutation((trpc) =>
    trpc.pdfs.create.mutationOptions({
      onSuccess: () => invalidateQuery((trpc) => trpc.pdfs.list),
    }),
  );

  const updateMutation = useTRPCMutation((trpc) =>
    trpc.pdfs.update.mutationOptions({
      onSuccess: () => invalidateQuery((trpc) => trpc.pdfs.list),
    }),
  );

  const deleteMutation = useTRPCMutation((trpc) =>
    trpc.pdfs.delete.mutationOptions({
      onSuccess: () => invalidateQuery((trpc) => trpc.pdfs.list),
    }),
  );

  const handleDelete = useCallback(
    async (id: string) => {
      if (window.confirm('Are you sure you want to delete this PDF?')) {
        await deleteMutation.mutateAsync({ id });
      }
    },
    [deleteMutation],
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      setParams({ page: newPage }).catch(() => {
        toast.error('Failed to update page');
      });
    },
    [setParams],
  );

  const refresh = useCallback(() => {
    invalidateQuery((trpc) => trpc.pdfs.list).catch(() => {
      toast.error('Failed to refresh list');
    });
  }, [invalidateQuery]);

  if (isLoading) {
    return <div className="flex items-center justify-center py-8">Loading...</div>;
  }

  if (error !== null) {
    return <div className="py-8 text-center text-red-500">Error: {error.message}</div>;
  }

  const pdfs = data?.pdfs ?? [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">PDF Templates</h1>
          <p className="text-muted-foreground">Manage your PDF templates</p>
        </div>
        <MutationModal
          button={
            <Button>
              <Plus className="mr-2 size-4" />
              Create PDF
            </Button>
          }
          defaultValues={{ name: '' }}
          fields={[
            {
              name: 'name',
              label: 'Name',
              type: 'input',
              placeholder: 'Enter PDF name',
            },
          ]}
          mutation={createMutation}
          refresh={refresh}
          schema={createPdfSchema}
          successToast={() => 'PDF created successfully'}
          titleText="Create New PDF"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pdfs.length === 0 ? (
              <TableRow>
                <TableCell className="text-muted-foreground py-8 text-center" colSpan={4}>
                  No PDFs found. Create your first PDF template!
                </TableCell>
              </TableRow>
            ) : (
              pdfs.map((pdfItem) => (
                <TableRow key={pdfItem.id}>
                  <TableCell className="font-medium">
                    <Link
                      className="hover:text-primary hover:underline"
                      href={`/pdf-editor/${pdfItem.id}`}
                    >
                      {pdfItem.name}
                    </Link>
                  </TableCell>
                  <TableCell>{format(new Date(pdfItem.createdAt), 'PPp')}</TableCell>
                  <TableCell>{format(new Date(pdfItem.updatedAt), 'PPp')}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/pdf-editor/${pdfItem.id}`}>
                            <Edit className="mr-2 size-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <MutationModal
                          button={
                            <DropdownMenuItem
                              onSelect={(e) => {
                                e.preventDefault();
                              }}
                            >
                              <Edit className="mr-2 size-4" />
                              Rename
                            </DropdownMenuItem>
                          }
                          defaultValues={{ id: pdfItem.id, name: pdfItem.name }}
                          fields={[
                            {
                              name: 'name',
                              label: 'Name',
                              type: 'input',
                              placeholder: 'Enter PDF name',
                            },
                          ]}
                          mutation={updateMutation}
                          refresh={refresh}
                          schema={updatePdfSchema}
                          successToast={() => 'PDF renamed successfully'}
                          titleText="Rename PDF"
                        />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => {
                            void handleDelete(pdfItem.id);
                          }}
                        >
                          <Trash2 className="mr-2 size-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {pagination !== undefined && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-sm">
            Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}{' '}
            results
          </p>
          <div className="flex gap-2">
            <Button
              disabled={pagination.page <= 1}
              variant="outline"
              onClick={() => {
                handlePageChange(pagination.page - 1);
              }}
            >
              Previous
            </Button>
            <Button
              disabled={pagination.page >= pagination.totalPages}
              variant="outline"
              onClick={() => {
                handlePageChange(pagination.page + 1);
              }}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
