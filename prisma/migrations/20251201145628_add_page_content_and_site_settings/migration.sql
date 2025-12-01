-- CreateTable
CREATE TABLE "page_contents" (
    "id" TEXT NOT NULL,
    "pageKey" TEXT NOT NULL,
    "contentUa" TEXT,
    "contentRu" TEXT,
    "contentEn" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "page_contents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "site_settings" (
    "id" TEXT NOT NULL,
    "managerLinkUa" TEXT,
    "managerLinkRu" TEXT,
    "managerLinkEn" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "page_contents_pageKey_key" ON "page_contents"("pageKey");
