import type { ReactNode } from "react";

import { CloudflareStreamUpload } from "@/components/admin/content/cloudflare-stream-upload";
import { builderUpdateTypes } from "@/lib/services/builder-updates";

type FormAction = (formData: FormData) => void | Promise<void>;

type ProductOption = {
  id: string;
  name: string;
  slug: string;
};

type ProgramOption = {
  id: string;
  title: string;
  slug: string;
  isPublished: boolean;
  status: string;
};

type ModuleOption = {
  id: string;
  title: string;
  slug: string;
  sortOrder: number;
  program: {
    id: string;
    title: string;
  };
};

type ProgramFormValue = {
  title?: string | null;
  slug?: string | null;
  description?: string | null;
  productId?: string | null;
  status?: string | null;
  opensAt?: Date | string | null;
  presaleMessage?: string | null;
  isPublished?: boolean;
};

type ModuleFormValue = {
  programId?: string | null;
  title?: string | null;
  slug?: string | null;
  description?: string | null;
  sortOrder?: number;
  isPublished?: boolean;
};

type LessonFormValue = {
  id?: string | null;
  programId?: string | null;
  moduleId?: string | null;
  title?: string | null;
  slug?: string | null;
  description?: string | null;
  content?: string | null;
  videoUrl?: string | null;
  videoProvider?: string | null;
  streamVideoId?: string | null;
  videoStatus?: string | null;
  videoTitle?: string | null;
  videoThumbnailUrl?: string | null;
  videoDuration?: number | null;
  isPreview?: boolean;
  sortOrder?: number;
  isPublished?: boolean;
};

type BuilderUpdateFormValue = {
  title?: string | null;
  type?: string | null;
  summary?: string | null;
  content?: string | null;
  imageUrl?: string | null;
  isPublished?: boolean;
};

function FieldLabel({ children }: { children: ReactNode }) {
  return <span className="text-sm font-semibold text-neutral-700">{children}</span>;
}

function TextInput({
  name,
  defaultValue,
  required = false,
  placeholder,
}: {
  name: string;
  defaultValue?: string | null;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <input
      name={name}
      required={required}
      defaultValue={defaultValue ?? ""}
      placeholder={placeholder}
      className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none transition focus:border-accent"
    />
  );
}

function DateTimeInput({
  name,
  defaultValue,
}: {
  name: string;
  defaultValue?: Date | string | null;
}) {
  const normalizedValue =
    defaultValue instanceof Date
      ? defaultValue.toISOString().slice(0, 16)
      : (defaultValue ?? "");

  return (
    <input
      type="datetime-local"
      name={name}
      defaultValue={normalizedValue}
      className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none transition focus:border-accent"
    />
  );
}

function TextArea({
  name,
  defaultValue,
  rows = 4,
  required = false,
  placeholder,
}: {
  name: string;
  defaultValue?: string | null;
  rows?: number;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <textarea
      name={name}
      required={required}
      rows={rows}
      defaultValue={defaultValue ?? ""}
      placeholder={placeholder}
      className="w-full rounded-md border border-border bg-background px-3 py-3 text-sm leading-6 outline-none transition focus:border-accent"
    />
  );
}

function SubmitButton({ label }: { label: string }) {
  return (
    <button
      type="submit"
      className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground"
    >
      {label}
    </button>
  );
}

function PublishCheckbox({ defaultChecked }: { defaultChecked?: boolean }) {
  return (
    <label className="flex items-center gap-3 rounded-md border border-border bg-background px-3 py-3">
      <input
        type="checkbox"
        name="isPublished"
        defaultChecked={defaultChecked}
        className="h-4 w-4 accent-[var(--accent)]"
      />
      <span className="text-sm font-semibold text-foreground">Publicado</span>
    </label>
  );
}

function PreviewCheckbox({ defaultChecked }: { defaultChecked?: boolean }) {
  return (
    <label className="flex items-center gap-3 rounded-md border border-border bg-background px-3 py-3">
      <input
        type="checkbox"
        name="isPreview"
        defaultChecked={defaultChecked}
        className="h-4 w-4 accent-[var(--accent)]"
      />
      <span className="text-sm font-semibold text-foreground">
        Video preview
      </span>
    </label>
  );
}

export function ProgramForm({
  action,
  products,
  program,
  submitLabel,
}: {
  action: FormAction;
  products: ProductOption[];
  program?: ProgramFormValue | null;
  submitLabel: string;
}) {
  return (
    <form action={action} className="space-y-5">
      <label className="block space-y-2">
        <FieldLabel>Titulo</FieldLabel>
        <TextInput
          name="title"
          required
          defaultValue={program?.title}
          placeholder="Build IdeaCash — Founder Access"
        />
      </label>

      <label className="block space-y-2">
        <FieldLabel>Slug</FieldLabel>
        <TextInput
          name="slug"
          required
          defaultValue={program?.slug}
          placeholder="build-ideacash-founder-access"
        />
      </label>

      <label className="block space-y-2">
        <FieldLabel>Producto asociado</FieldLabel>
        <select
          name="productId"
          defaultValue={program?.productId ?? ""}
          className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none transition focus:border-accent"
        >
          <option value="">Sin producto asociado</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>
      </label>

      <label className="block space-y-2">
        <FieldLabel>Descripcion</FieldLabel>
        <TextArea
          name="description"
          defaultValue={program?.description}
          placeholder="Describe la promesa y alcance del programa."
        />
      </label>

      <div className="rounded-xl border border-border bg-surface-muted p-4">
        <div>
          <p className="text-sm font-semibold text-foreground">
            Estado del programa
          </p>
          <p className="mt-1 text-sm leading-6 text-neutral-500">
            Usa Borrador para ocultarlo, Preventa para vender acceso fundador
            antes de abrir el recorrido, y Abierto para consumo normal.
          </p>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <label className="block space-y-2">
            <FieldLabel>Estado</FieldLabel>
            <select
              name="status"
              defaultValue={program?.status ?? "DRAFT"}
              className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none transition focus:border-accent"
            >
              <option value="DRAFT">Borrador</option>
              <option value="PRESALE">Preventa</option>
              <option value="OPEN">Abierto</option>
            </select>
          </label>

          <label className="block space-y-2">
            <FieldLabel>Apertura oficial</FieldLabel>
            <DateTimeInput name="opensAt" defaultValue={program?.opensAt} />
          </label>
        </div>

        <label className="mt-4 block space-y-2">
          <FieldLabel>Mensaje de preventa opcional</FieldLabel>
          <TextArea
            name="presaleMessage"
            rows={3}
            defaultValue={program?.presaleMessage}
            placeholder="Mensaje premium para compradores en preventa."
          />
        </label>
      </div>

      <SubmitButton label={submitLabel} />
    </form>
  );
}

export function ModuleForm({
  action,
  programs,
  module,
  submitLabel,
}: {
  action: FormAction;
  programs: ProgramOption[];
  module?: ModuleFormValue | null;
  submitLabel: string;
}) {
  return (
    <form action={action} className="space-y-5">
      <label className="block space-y-2">
        <FieldLabel>Programa</FieldLabel>
        <select
          name="programId"
          required
          defaultValue={module?.programId ?? ""}
          className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none transition focus:border-accent"
        >
          <option value="">Selecciona un programa</option>
          {programs.map((program) => (
            <option key={program.id} value={program.id}>
              {program.title}
            </option>
          ))}
        </select>
      </label>

      <div className="grid gap-4 md:grid-cols-[1fr_160px]">
        <label className="block space-y-2">
          <FieldLabel>Titulo</FieldLabel>
          <TextInput
            name="title"
            required
            defaultValue={module?.title}
            placeholder="Claridad de oferta"
          />
        </label>
        <label className="block space-y-2">
          <FieldLabel>Orden</FieldLabel>
          <TextInput name="sortOrder" defaultValue={`${module?.sortOrder ?? 0}`} />
        </label>
      </div>

      <label className="block space-y-2">
        <FieldLabel>Slug</FieldLabel>
        <TextInput
          name="slug"
          required
          defaultValue={module?.slug}
          placeholder="claridad-de-oferta"
        />
      </label>

      <label className="block space-y-2">
        <FieldLabel>Descripcion</FieldLabel>
        <TextArea
          name="description"
          defaultValue={module?.description}
          placeholder="Objetivo breve del modulo."
        />
      </label>

      <PublishCheckbox defaultChecked={module?.isPublished} />

      <SubmitButton label={submitLabel} />
    </form>
  );
}

export function LessonForm({
  action,
  programs,
  modules,
  lesson,
  submitLabel,
}: {
  action: FormAction;
  programs: ProgramOption[];
  modules: ModuleOption[];
  lesson?: LessonFormValue | null;
  submitLabel: string;
}) {
  return (
    <form action={action} className="space-y-5">
      <div className="grid gap-4 lg:grid-cols-2">
        <label className="block space-y-2">
          <FieldLabel>Programa</FieldLabel>
          <select
            name="programId"
            defaultValue={lesson?.programId ?? ""}
            className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none transition focus:border-accent"
          >
            <option value="">Selecciona un programa</option>
            {programs.map((program) => (
              <option key={program.id} value={program.id}>
                {program.title}
              </option>
            ))}
          </select>
          <span className="text-xs leading-5 text-neutral-500">
            El programa guardado se toma del módulo seleccionado para evitar
            cruces accidentales.
          </span>
        </label>

        <label className="block space-y-2">
          <FieldLabel>Modulo</FieldLabel>
          <select
            name="moduleId"
            required
            defaultValue={lesson?.moduleId ?? ""}
            className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none transition focus:border-accent"
          >
            <option value="">Selecciona un modulo</option>
            {modules.map((module) => (
              <option key={module.id} value={module.id}>
                {module.program.title} / {module.sortOrder}. {module.title}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr_160px]">
        <label className="block space-y-2">
          <FieldLabel>Titulo</FieldLabel>
          <TextInput
            name="title"
            required
            defaultValue={lesson?.title}
            placeholder="Mapa de idea a oferta"
          />
        </label>
        <label className="block space-y-2">
          <FieldLabel>Orden</FieldLabel>
          <TextInput name="sortOrder" defaultValue={`${lesson?.sortOrder ?? 0}`} />
        </label>
      </div>

      <label className="block space-y-2">
        <FieldLabel>Slug</FieldLabel>
        <TextInput
          name="slug"
          required
          defaultValue={lesson?.slug}
          placeholder="mapa-de-idea-a-oferta"
        />
      </label>

      <label className="block space-y-2">
        <FieldLabel>Descripcion</FieldLabel>
        <TextArea
          name="description"
          defaultValue={lesson?.description}
          placeholder="Resumen claro de la leccion."
        />
      </label>

      <label className="block space-y-2">
        <FieldLabel>Contenido base</FieldLabel>
        <TextArea
          name="content"
          rows={8}
          defaultValue={lesson?.content}
          placeholder="Contenido textual que vera el usuario."
        />
      </label>

      <label className="block space-y-2">
        <FieldLabel>Video URL externa opcional</FieldLabel>
        <TextInput
          name="videoUrl"
          defaultValue={lesson?.videoUrl}
          placeholder="https://youtube.com/watch?v=..."
        />
        <span className="text-xs leading-5 text-neutral-500">
          Campo de compatibilidad. El flujo principal del LMS usa Cloudflare
          Stream.
        </span>
      </label>

      <div className="rounded-xl border border-border bg-surface-muted p-4">
        <div>
          <p className="text-sm font-semibold text-foreground">
            Video de la lección
          </p>
          <p className="mt-1 text-sm leading-6 text-neutral-500">
            Este es el punto principal de carga y configuración del video. La
            biblioteca de Videos solo sirve para revisar videos ya vinculados.
          </p>
        </div>

        <div className="mt-4">
          <CloudflareStreamUpload
            lessonId={lesson?.id}
            lessonTitle={lesson?.title}
            streamVideoId={lesson?.streamVideoId}
            videoStatus={lesson?.videoStatus}
          />
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <label className="block space-y-2">
            <FieldLabel>Proveedor</FieldLabel>
            <select
              name="videoProvider"
              defaultValue={lesson?.videoProvider ?? ""}
              className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none transition focus:border-accent"
            >
              <option value="">Sin proveedor</option>
              <option value="YouTube">YouTube</option>
              <option value="Cloudflare Stream">Cloudflare Stream</option>
              <option value="Vimeo">Vimeo</option>
              <option value="Loom">Loom</option>
              <option value="Mux">Mux</option>
              <option value="Directo">Archivo directo</option>
            </select>
          </label>

          <label className="block space-y-2">
            <FieldLabel>Título del video</FieldLabel>
            <TextInput
              name="videoTitle"
              defaultValue={lesson?.videoTitle}
              placeholder="Introducción al build"
            />
          </label>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_180px]">
          <label className="block space-y-2">
            <FieldLabel>Thumbnail opcional</FieldLabel>
            <TextInput
              name="videoThumbnailUrl"
              defaultValue={lesson?.videoThumbnailUrl}
              placeholder="https://..."
            />
          </label>

          <label className="block space-y-2">
            <FieldLabel>Duración en segundos</FieldLabel>
            <TextInput
              name="videoDuration"
              defaultValue={
                lesson?.videoDuration != null ? `${lesson.videoDuration}` : ""
              }
              placeholder="420"
            />
          </label>
        </div>

        <div className="mt-4">
          <PreviewCheckbox defaultChecked={lesson?.isPreview} />
        </div>
      </div>

      <PublishCheckbox defaultChecked={lesson?.isPublished} />

      <SubmitButton label={submitLabel} />
    </form>
  );
}

export function LessonVideoManualAssociate({
  lessonId,
  streamVideoId,
  videoStatus,
  videoDuration,
  associateAction,
  clearAction,
}: {
  lessonId: string;
  streamVideoId: string | null;
  videoStatus: string | null;
  videoDuration: number | null;
  associateAction: (lessonId: string, formData: FormData) => Promise<void>;
  clearAction: (lessonId: string) => Promise<void>;
}) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          Asociar video por UID (alternativa manual)
        </h2>
        <p className="mt-1 text-sm leading-6 text-neutral-500">
          Si la subida directa desde la lección falla, o ya tienes el video
          subido a Cloudflare desde su Dashboard, pega aquí el Stream Video ID
          para vincularlo manualmente. El UID es un código de 32 caracteres
          hexadecimales — lo encuentras en la URL del video dentro de
          Cloudflare Stream.
        </p>
      </div>

      {streamVideoId ? (
        <div className="rounded-md border border-border bg-surface-muted p-3 text-sm text-neutral-700">
          <p>
            Video actualmente vinculado:{" "}
            <code className="rounded bg-background px-1.5 py-0.5 text-xs">
              {streamVideoId}
            </code>
          </p>
          <p className="mt-1 text-xs text-neutral-500">
            Estado: {videoStatus ?? "NONE"}
            {videoDuration ? ` · Duración: ${videoDuration}s` : ""}
          </p>
        </div>
      ) : (
        <p className="rounded-md border border-dashed border-border bg-surface-muted px-4 py-3 text-sm text-neutral-600">
          Esta lección no tiene video vinculado todavía.
        </p>
      )}

      <form
        action={associateAction.bind(null, lessonId)}
        className="space-y-3"
      >
        <label className="block space-y-2">
          <FieldLabel>Stream Video ID (UID de Cloudflare)</FieldLabel>
          <TextInput
            name="streamVideoId"
            required
            placeholder="ej: 27973408cd1e32743b50302536377ab2"
          />
        </label>
        <SubmitButton
          label={
            streamVideoId
              ? "Reemplazar video con este UID"
              : "Asociar video con este UID"
          }
        />
      </form>

      {streamVideoId ? (
        <form action={clearAction.bind(null, lessonId)}>
          <button
            type="submit"
            className="text-xs font-semibold uppercase tracking-[0.12em] text-red-600 hover:underline"
          >
            Desvincular video de esta lección
          </button>
        </form>
      ) : null}
    </div>
  );
}

export function BuilderUpdateForm({
  action,
  update,
  submitLabel,
}: {
  action: FormAction;
  update?: BuilderUpdateFormValue | null;
  submitLabel: string;
}) {
  return (
    <form action={action} className="space-y-5">
      <label className="block space-y-2">
        <FieldLabel>Título</FieldLabel>
        <TextInput
          name="title"
          required
          defaultValue={update?.title}
          placeholder="Nueva lección publicada dentro de Builder"
        />
      </label>

      <label className="block space-y-2">
        <FieldLabel>Tipo</FieldLabel>
        <select
          name="type"
          defaultValue={update?.type ?? "NOVEDAD"}
          className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none transition focus:border-accent"
        >
          {builderUpdateTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </label>

      <label className="block space-y-2">
        <FieldLabel>Resumen</FieldLabel>
        <TextArea
          name="summary"
          required
          rows={3}
          defaultValue={update?.summary}
          placeholder="Una síntesis clara para el feed privado."
        />
      </label>

      <label className="block space-y-2">
        <FieldLabel>Contenido</FieldLabel>
        <TextArea
          name="content"
          required
          rows={8}
          defaultValue={update?.content}
          placeholder="Desarrolla la novedad, tip o recomendación con criterio práctico."
        />
      </label>

      <label className="block space-y-2">
        <FieldLabel>Imagen opcional</FieldLabel>
        <TextInput
          name="imageUrl"
          defaultValue={update?.imageUrl}
          placeholder="https://..."
        />
      </label>

      <PublishCheckbox defaultChecked={update?.isPublished} />

      <SubmitButton label={submitLabel} />
    </form>
  );
}

type LessonPromptValue = {
  id: string;
  title: string;
  body: string;
  sortOrder: number;
};

type LessonResourceValue = {
  id: string;
  title: string;
  description: string | null;
  url: string;
  type: string;
  sortOrder: number;
};

function NumberInput({
  name,
  defaultValue,
}: {
  name: string;
  defaultValue?: number;
}) {
  return (
    <input
      type="number"
      name={name}
      defaultValue={defaultValue ?? 0}
      className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none transition focus:border-accent"
    />
  );
}

export function LessonPromptsManager({
  lessonId,
  prompts,
  createAction,
  updateAction,
  deleteAction,
}: {
  lessonId: string;
  prompts: LessonPromptValue[];
  createAction: (lessonId: string, formData: FormData) => Promise<void>;
  updateAction: (promptId: string, formData: FormData) => Promise<void>;
  deleteAction: (promptId: string) => Promise<void>;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Prompts</h2>
        <p className="mt-1 text-sm leading-6 text-neutral-500">
          Bloques copy-paste que se muestran al usuario con botón de copiar. Útil
          para entregar prompts de IA, snippets de código o plantillas.
        </p>
      </div>

      {prompts.length === 0 ? (
        <p className="rounded-md border border-dashed border-border bg-surface-muted px-4 py-3 text-sm text-neutral-600">
          Todavía no hay prompts. Agrega el primero abajo.
        </p>
      ) : (
        <div className="space-y-4">
          {prompts.map((prompt) => (
            <div
              key={prompt.id}
              className="rounded-xl border border-border bg-background p-4"
            >
              <form
                action={updateAction.bind(null, prompt.id)}
                className="space-y-3"
              >
                <div className="grid gap-3 md:grid-cols-[1fr_120px]">
                  <label className="block space-y-2">
                    <FieldLabel>Título</FieldLabel>
                    <TextInput
                      name="title"
                      required
                      defaultValue={prompt.title}
                    />
                  </label>
                  <label className="block space-y-2">
                    <FieldLabel>Orden</FieldLabel>
                    <NumberInput
                      name="sortOrder"
                      defaultValue={prompt.sortOrder}
                    />
                  </label>
                </div>
                <label className="block space-y-2">
                  <FieldLabel>Cuerpo del prompt</FieldLabel>
                  <TextArea
                    name="body"
                    rows={6}
                    required
                    defaultValue={prompt.body}
                  />
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  <SubmitButton label="Guardar prompt" />
                </div>
              </form>
              <form action={deleteAction.bind(null, prompt.id)} className="mt-3">
                <button
                  type="submit"
                  className="text-xs font-semibold uppercase tracking-[0.12em] text-red-600 hover:underline"
                >
                  Eliminar prompt
                </button>
              </form>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-xl border border-dashed border-border bg-surface-muted p-4">
        <p className="text-sm font-semibold text-foreground">Agregar prompt</p>
        <form
          action={createAction.bind(null, lessonId)}
          className="mt-3 space-y-3"
        >
          <div className="grid gap-3 md:grid-cols-[1fr_120px]">
            <label className="block space-y-2">
              <FieldLabel>Título</FieldLabel>
              <TextInput
                name="title"
                required
                placeholder="Prompt 1 — Generar idea inicial"
              />
            </label>
            <label className="block space-y-2">
              <FieldLabel>Orden</FieldLabel>
              <NumberInput name="sortOrder" defaultValue={0} />
            </label>
          </div>
          <label className="block space-y-2">
            <FieldLabel>Cuerpo del prompt</FieldLabel>
            <TextArea
              name="body"
              rows={6}
              required
              placeholder="Pega aquí el prompt completo que el usuario podrá copiar."
            />
          </label>
          <SubmitButton label="Agregar prompt" />
        </form>
      </div>
    </div>
  );
}

const resourceTypeLabels: Record<string, string> = {
  LINK: "Link externo",
  DOWNLOAD: "Descarga / archivo",
  REFERENCE: "Referencia / lectura",
};

export function LessonResourcesManager({
  lessonId,
  resources,
  createAction,
  updateAction,
  deleteAction,
}: {
  lessonId: string;
  resources: LessonResourceValue[];
  createAction: (lessonId: string, formData: FormData) => Promise<void>;
  updateAction: (resourceId: string, formData: FormData) => Promise<void>;
  deleteAction: (resourceId: string) => Promise<void>;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Recursos</h2>
        <p className="mt-1 text-sm leading-6 text-neutral-500">
          Links externos, descargas o referencias complementarias. Aparecen como
          tarjetas debajo del contenido de la lección.
        </p>
      </div>

      {resources.length === 0 ? (
        <p className="rounded-md border border-dashed border-border bg-surface-muted px-4 py-3 text-sm text-neutral-600">
          Todavía no hay recursos. Agrega el primero abajo.
        </p>
      ) : (
        <div className="space-y-4">
          {resources.map((resource) => (
            <div
              key={resource.id}
              className="rounded-xl border border-border bg-background p-4"
            >
              <form
                action={updateAction.bind(null, resource.id)}
                className="space-y-3"
              >
                <div className="grid gap-3 md:grid-cols-[1fr_180px_120px]">
                  <label className="block space-y-2">
                    <FieldLabel>Título</FieldLabel>
                    <TextInput
                      name="title"
                      required
                      defaultValue={resource.title}
                    />
                  </label>
                  <label className="block space-y-2">
                    <FieldLabel>Tipo</FieldLabel>
                    <select
                      name="type"
                      defaultValue={resource.type}
                      className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none transition focus:border-accent"
                    >
                      {Object.entries(resourceTypeLabels).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block space-y-2">
                    <FieldLabel>Orden</FieldLabel>
                    <NumberInput
                      name="sortOrder"
                      defaultValue={resource.sortOrder}
                    />
                  </label>
                </div>
                <label className="block space-y-2">
                  <FieldLabel>URL</FieldLabel>
                  <TextInput name="url" required defaultValue={resource.url} />
                </label>
                <label className="block space-y-2">
                  <FieldLabel>Descripción (opcional)</FieldLabel>
                  <TextArea
                    name="description"
                    rows={2}
                    defaultValue={resource.description}
                  />
                </label>
                <SubmitButton label="Guardar recurso" />
              </form>
              <form
                action={deleteAction.bind(null, resource.id)}
                className="mt-3"
              >
                <button
                  type="submit"
                  className="text-xs font-semibold uppercase tracking-[0.12em] text-red-600 hover:underline"
                >
                  Eliminar recurso
                </button>
              </form>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-xl border border-dashed border-border bg-surface-muted p-4">
        <p className="text-sm font-semibold text-foreground">Agregar recurso</p>
        <form
          action={createAction.bind(null, lessonId)}
          className="mt-3 space-y-3"
        >
          <div className="grid gap-3 md:grid-cols-[1fr_180px_120px]">
            <label className="block space-y-2">
              <FieldLabel>Título</FieldLabel>
              <TextInput
                name="title"
                required
                placeholder="Plantilla Notion para captura de ideas"
              />
            </label>
            <label className="block space-y-2">
              <FieldLabel>Tipo</FieldLabel>
              <select
                name="type"
                defaultValue="LINK"
                className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none transition focus:border-accent"
              >
                {Object.entries(resourceTypeLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block space-y-2">
              <FieldLabel>Orden</FieldLabel>
              <NumberInput name="sortOrder" defaultValue={0} />
            </label>
          </div>
          <label className="block space-y-2">
            <FieldLabel>URL</FieldLabel>
            <TextInput
              name="url"
              required
              placeholder="https://notion.so/..."
            />
          </label>
          <label className="block space-y-2">
            <FieldLabel>Descripción (opcional)</FieldLabel>
            <TextArea
              name="description"
              rows={2}
              placeholder="Qué encontrarás en este recurso."
            />
          </label>
          <SubmitButton label="Agregar recurso" />
        </form>
      </div>
    </div>
  );
}

type ProductFormValue = {
  name?: string | null;
  slug?: string | null;
  description?: string | null;
  stripePriceId?: string | null;
  isActive?: boolean;
};

export function ProductForm({
  action,
  product,
  submitLabel,
}: {
  action: FormAction;
  product?: ProductFormValue | null;
  submitLabel: string;
}) {
  return (
    <form action={action} className="space-y-5">
      <label className="block space-y-2">
        <FieldLabel>Nombre del producto</FieldLabel>
        <TextInput
          name="name"
          required
          defaultValue={product?.name}
          placeholder="Build IdeaCash — Founder Access"
        />
      </label>

      <label className="block space-y-2">
        <FieldLabel>Slug</FieldLabel>
        <TextInput
          name="slug"
          required
          defaultValue={product?.slug}
          placeholder="build-ideacash-founder-access"
        />
      </label>

      <label className="block space-y-2">
        <FieldLabel>Descripción</FieldLabel>
        <TextArea
          name="description"
          defaultValue={product?.description}
          placeholder="Describe qué desbloquea este producto comercialmente."
        />
      </label>

      <label className="block space-y-2">
        <FieldLabel>Stripe Price ID</FieldLabel>
        <TextInput
          name="stripePriceId"
          defaultValue={product?.stripePriceId}
          placeholder="price_1Q..."
        />
        <span className="block text-xs leading-5 text-neutral-500">
          Crea el precio primero en Stripe Dashboard (modo Test o Live según
          corresponda) y pega aquí el ID que empieza con <code>price_</code>.
          Sin este valor el producto existe pero no es comprable vía Stripe
          Checkout.
        </span>
      </label>

      <label className="flex items-center gap-3 rounded-md border border-border bg-background px-3 py-3">
        <input
          type="checkbox"
          name="isActive"
          defaultChecked={product?.isActive ?? true}
          className="h-4 w-4 accent-[var(--accent)]"
        />
        <span className="text-sm font-semibold text-foreground">
          Producto activo
        </span>
      </label>

      <SubmitButton label={submitLabel} />
    </form>
  );
}
