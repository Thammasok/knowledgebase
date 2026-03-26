import { cn } from '@/lib/utils'
import { UseFormReturn } from 'react-hook-form'
import { MinusIcon } from 'lucide-react'
import { DynamicIcon, IconName } from 'lucide-react/dynamic'
import { Field, FieldGroup } from '@/components/ui/field'
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { COLOR_OPTIONS } from '@/constants/color-option.constant'
import { ICON_OPTIONS } from '@/constants/icon-option.constant'
import { WorkspaceForm } from './use-workspace-create.hook'

// ─── Constants ────────────────────────────────────────────────────────────────

const DEFAULT_COLOR = COLOR_OPTIONS[0].value

// ─── Component ────────────────────────────────────────────────────────────────

interface WorkspaceCreateFormProps {
  form: UseFormReturn<WorkspaceForm>
}

export const WorkspaceCreateForm = ({ form }: WorkspaceCreateFormProps) => {
  const workspaceName = form.watch('name') ?? ''
  const selectedIcon = (form.watch('logo') ?? '') as IconName | ''
  const selectedColor = form.watch('color') ?? DEFAULT_COLOR

  return (
    <FieldGroup>
      <Field>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="flex items-center gap-3">
                  <div
                    className="flex size-10 shrink-0 items-center justify-center rounded-lg text-white transition-colors"
                    style={{ backgroundColor: selectedColor }}
                  >
                    {selectedIcon ? (
                      <DynamicIcon name={selectedIcon} className="size-5" />
                    ) : (
                      <span className="text-sm font-semibold leading-none">
                        {workspaceName.charAt(0).toUpperCase() || 'W'}
                      </span>
                    )}
                  </div>

                  <Input id="name" placeholder="Workspace name" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </Field>

      <Field>
        <Tabs defaultValue="color">
          <TabsList className="w-full">
            <TabsTrigger value="color" className="flex-1">
              Color
            </TabsTrigger>
            <TabsTrigger value="icon" className="flex-1">
              Icon
              <span className="ml-1 text-muted-foreground/60">(optional)</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="color">
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ScrollArea className="h-56">
                      <div className="flex flex-wrap gap-2 pt-2 px-2">
                        {COLOR_OPTIONS.map(({ value, label }) => (
                          <button
                            key={value}
                            type="button"
                            title={label}
                            onClick={() => form.setValue('color', value)}
                            className={cn(
                              'size-7 rounded-md transition-all hover:scale-105',
                              field.value === value
                                ? 'scale-110 ring-2 ring-offset-2 ring-offset-background'
                                : '',
                            )}
                            style={
                              {
                                backgroundColor: value,
                                '--tw-ring-color': value,
                              } as React.CSSProperties
                            }
                          />
                        ))}
                      </div>
                    </ScrollArea>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          <TabsContent value="icon">
            <FormField
              control={form.control}
              name="logo"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ScrollArea className="h-56">
                      <div className="grid grid-cols-[repeat(auto-fill,minmax(2rem,1fr))] gap-1 pt-2 px-2">
                        <button
                          type="button"
                          title="None"
                          onClick={() => form.setValue('logo', '')}
                          className={cn(
                            'flex size-8 items-center justify-center rounded-md border transition-colors hover:bg-accent hover:text-accent-foreground',
                            field.value === ''
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-transparent text-muted-foreground',
                          )}
                        >
                          <MinusIcon className="size-3.5" />
                        </button>

                        {ICON_OPTIONS.map(({ name, label }) => (
                          <button
                            key={name}
                            type="button"
                            title={label}
                            onClick={() => form.setValue('logo', name)}
                            className={cn(
                              'flex size-8 items-center justify-center rounded-md border transition-colors hover:bg-accent hover:text-accent-foreground',
                              selectedIcon === name
                                ? 'border-primary bg-primary/10 text-primary'
                                : 'border-transparent',
                            )}
                          >
                            <DynamicIcon name={name} className="size-4" />
                          </button>
                        ))}
                      </div>
                    </ScrollArea>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
        </Tabs>
      </Field>
    </FieldGroup>
  )
}
