"use client";

import { useEffect, useState } from "react";
import { SEARCH_DEBOUNCE_MS } from "@opsflow/shared";

import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Input } from "@/components/ui/Input";
import { Pagination } from "@/components/ui/Pagination";
import { SkeletonRows } from "@/components/ui/Skeleton";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/Table";
import { CustomerDetailsDrawer } from "@/features/customers/CustomerDetailsDrawer";
import { useDebounce } from "@/hooks/useDebounce";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchCustomerById,
  fetchCustomers,
  selectCustomers,
  selectCustomersError,
  selectCustomersIsEmpty,
  selectCustomersState,
  selectCustomersStatus,
} from "@/store/slices/customers";

export function CustomersPageClient() {
  const dispatch = useAppDispatch();
  const customers = useAppSelector(selectCustomers);
  const status = useAppSelector(selectCustomersStatus);
  const error = useAppSelector(selectCustomersError);
  const isEmpty = useAppSelector(selectCustomersIsEmpty);
  const { totalCount } = useAppSelector(selectCustomersState);

  const [page, setPage] = useState(1);
  const pageSize = 20;
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, SEARCH_DEBOUNCE_MS);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    // Reset to first page when search changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sync page with query
    setPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    void dispatch(
      fetchCustomers({
        page,
        pageSize,
        q: debouncedSearch || undefined,
      }),
    );
  }, [dispatch, page, pageSize, debouncedSearch]);

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return (
    <AppShell
      title="Customers"
      description="Customer directory and related service jobs."
    >
      <div className="space-y-4">
        <Input
          aria-label="Search customers"
          placeholder="Search name, email, company, location…"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <Card>
          <CardBody className="p-0">
            {status === "loading" || status === "idle" ? (
              <div className="p-4">
                <SkeletonRows rows={8} />
              </div>
            ) : null}

            {status === "failed" ? (
              <div className="p-4">
                <ErrorState
                  title="Unable to load customers"
                  description={error ?? undefined}
                  onRetry={() => {
                    void dispatch(
                      fetchCustomers({
                        page,
                        pageSize,
                        q: debouncedSearch || undefined,
                      }),
                    );
                  }}
                />
              </div>
            ) : null}

            {status === "succeeded" && isEmpty ? (
              <div className="p-4">
                <EmptyState
                  title="No customers found"
                  description="Try a different search term."
                />
              </div>
            ) : null}

            {status === "succeeded" && !isEmpty ? (
              <Table>
                <THead>
                  <TR>
                    <TH>Customer</TH>
                    <TH>Company</TH>
                    <TH>Location</TH>
                    <TH>Email</TH>
                    <TH>Phone</TH>
                    <TH className="w-24">Actions</TH>
                  </TR>
                </THead>
                <TBody>
                  {customers.map((customer) => (
                    <TR key={customer.id}>
                      <TD>
                        <p className="text-foreground font-medium">
                          {customer.name}
                        </p>
                        <p className="text-muted text-xs">{customer.id}</p>
                      </TD>
                      <TD className="whitespace-nowrap">
                        {customer.company ?? "—"}
                      </TD>
                      <TD className="whitespace-nowrap">{customer.location}</TD>
                      <TD className="whitespace-nowrap">{customer.email}</TD>
                      <TD className="whitespace-nowrap">{customer.phone}</TD>
                      <TD>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedId(customer.id);
                            void dispatch(fetchCustomerById(customer.id));
                          }}
                        >
                          View
                        </Button>
                      </TD>
                    </TR>
                  ))}
                </TBody>
              </Table>
            ) : null}
          </CardBody>
        </Card>

        {status === "succeeded" && !isEmpty ? (
          <Pagination
            page={page}
            totalPages={totalPages}
            totalCount={totalCount}
            pageSize={pageSize}
            onPageChange={setPage}
          />
        ) : null}
      </div>

      <CustomerDetailsDrawer
        open={Boolean(selectedId)}
        customerId={selectedId}
        onClose={() => setSelectedId(null)}
      />
    </AppShell>
  );
}
