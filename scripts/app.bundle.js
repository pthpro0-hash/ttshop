(() => {
  // scripts/data/catalog.js
  var CATEGORIES = [
    "\uBBF8\uC6A9\uAE30\uAD6C",
    "\uBBF8\uC6A9\uC7AC\uB8CC",
    "\uD654\uC7A5\uD488",
  ];
  var products = [
    {
      id: "device-led",
      name: "LED Skin Lifting Device",
      ko: "LED \uC2A4\uD0A8 \uB9AC\uD504\uD305 \uB514\uBC14\uC774\uC2A4",
      category: "\uBBF8\uC6A9\uAE30\uAD6C",
      type: "Home Beauty Device",
      badge: "Best",
      price: 89e3,
      sale: 76e3,
      option: "1ea / Warm White",
      short:
        "\uC9D1\uC5D0\uC11C\uB3C4 \uAC04\uD3B8\uD558\uAC8C \uC0AC\uC6A9\uD558\uB294 \uD648\uCF00\uC5B4 \uBBF8\uC6A9\uAE30\uAE30.",
      desc: "\uD53C\uBD80 \uD0C4\uB825 \uCF00\uC5B4\uC640 \uB370\uC77C\uB9AC \uD648\uCF00\uC5B4 \uB8E8\uD2F4\uC744 \uC704\uD574 \uC124\uACC4\uD55C \uAC10\uAC01\uC801\uC778 LED \uBBF8\uC6A9\uAE30\uAE30\uC785\uB2C8\uB2E4.",
      image:
        "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: "device-brush",
      name: "Scalp Massage Brush",
      ko: "\uC2A4\uCE7C\uD504 \uB9C8\uC0AC\uC9C0 \uBE0C\uB7EC\uC2DC",
      category: "\uBBF8\uC6A9\uAE30\uAD6C",
      type: "Scalp Care Tool",
      badge: "New",
      price: 18e3,
      sale: 15e3,
      option: "1ea / Soft Silicone",
      short:
        "\uB450\uD53C\uB97C \uBD80\uB4DC\uB7FD\uAC8C \uB9C8\uC0AC\uC9C0\uD574\uC8FC\uB294 \uC2E4\uB9AC\uCF58 \uBE0C\uB7EC\uC2DC.",
      desc: "\uC0F4\uD478\uC640 \uD568\uAED8 \uC0AC\uC6A9\uD558\uBA74 \uB450\uD53C\uB97C \uAC1C\uC6B4\uD558\uAC8C \uCF00\uC5B4\uD560 \uC218 \uC788\uB294 \uC18C\uD504\uD2B8 \uC2E4\uB9AC\uCF58 \uB9C8\uC0AC\uC9C0 \uBE0C\uB7EC\uC2DC\uC785\uB2C8\uB2E4.",
      image:
        "https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: "device-nail",
      name: "Nail Care Tool Set",
      ko: "\uB124\uC77C \uCF00\uC5B4 \uD234 \uC138\uD2B8",
      category: "\uBBF8\uC6A9\uAE30\uAD6C",
      type: "Nail Tool Set",
      badge: "Hot",
      price: 22e3,
      sale: 18e3,
      option: "3pcs Set / Silver",
      short:
        "\uC140\uD504 \uB124\uC77C \uAD00\uB9AC\uB97C \uC704\uD55C \uAE30\uBCF8 \uD234 \uC138\uD2B8.",
      desc: "\uD050\uD2F0\uD074 \uC815\uB9AC\uC640 \uC190\uD1B1 \uB77C\uC778 \uCF00\uC5B4\uB97C \uC9D1\uC5D0\uC11C\uB3C4 \uAE54\uB054\uD558\uAC8C \uD560 \uC218 \uC788\uB294 \uAE30\uBCF8 \uB124\uC77C \uD234 \uAD6C\uC131\uC785\uB2C8\uB2E4.",
      image:
        "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: "mat-ampoule",
      name: "Salon Hair Ampoule Pack",
      ko: "\uC0B4\uB871 \uD5E4\uC5B4 \uC570\uD50C \uD329",
      category: "\uBBF8\uC6A9\uC7AC\uB8CC",
      type: "Hair Treatment Material",
      badge: "Best",
      price: 32e3,
      sale: 27e3,
      option: "10ea / Repair",
      short:
        "\uC190\uC0C1 \uBAA8\uBC1C \uC9D1\uC911 \uCF00\uC5B4\uC6A9 \uC0B4\uB871 \uC570\uD50C.",
      desc: "\uAC70\uCE60\uACE0 \uD478\uC11D\uD55C \uBAA8\uBC1C\uC5D0 \uC601\uC591\uAC10\uC744 \uCC44\uC6CC\uC8FC\uB294 \uC0B4\uB871 \uC2A4\uD0C0\uC77C\uC758 \uC9D1\uC911 \uD5E4\uC5B4 \uCF00\uC5B4 \uC570\uD50C \uD329\uC785\uB2C8\uB2E4.",
      image:
        "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: "mat-glue",
      name: "Professional Eyelash Glue",
      ko: "\uD504\uB85C\uD398\uC154\uB110 \uC18D\uB208\uC379 \uAE00\uB8E8",
      category: "\uBBF8\uC6A9\uC7AC\uB8CC",
      type: "Eyelash Material",
      badge: "New",
      price: 16e3,
      sale: 13e3,
      option: "5ml / Clear",
      short:
        "\uC18D\uB208\uC379 \uC5F0\uC7A5\uACFC \uC140\uD504 \uC5F0\uCD9C\uC744 \uC704\uD55C \uC804\uC6A9 \uAE00\uB8E8.",
      desc: "\uAE54\uB054\uD55C \uB9C8\uBB34\uB9AC\uC640 \uC548\uC815\uC801\uC778 \uACE0\uC815\uAC10\uC744 \uACE0\uB824\uD55C \uC18D\uB208\uC379 \uC804\uC6A9 \uAE00\uB8E8\uC785\uB2C8\uB2E4.",
      image:
        "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: "mat-pack",
      name: "Moisture Modeling Pack",
      ko: "\uBAA8\uC774\uC2A4\uCC98 \uBAA8\uB378\uB9C1 \uD329",
      category: "\uBBF8\uC6A9\uC7AC\uB8CC",
      type: "Esthetic Pack Material",
      badge: "Hot",
      price: 28e3,
      sale: 23e3,
      option: "5ea / Hydration",
      short:
        "\uC5D0\uC2A4\uD14C\uD2F1 \uB290\uB08C\uC758 \uACE0\uBCF4\uC2B5 \uBAA8\uB378\uB9C1 \uD329.",
      desc: "\uD53C\uBD80\uC5D0 \uCFE8\uB9C1\uAC10\uACFC \uC218\uBD84\uAC10\uC744 \uBE60\uB974\uAC8C \uC804\uB2EC\uD558\uB294 \uD648 \uC5D0\uC2A4\uD14C\uD2F1\uC6A9 \uBAA8\uB378\uB9C1 \uD329\uC785\uB2C8\uB2E4.",
      image:
        "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: "cos-cream",
      name: "Calm Dew Barrier Cream",
      ko: "\uCE84 \uB4C0 \uBC30\uB9AC\uC5B4 \uD06C\uB9BC",
      category: "\uD654\uC7A5\uD488",
      type: "Skincare Cream",
      badge: "Best",
      price: 38e3,
      sale: 32e3,
      option: "50ml / \uBB34\uD5A5",
      short:
        "\uC18D\uAC74\uC870\uC640 \uC7A5\uBCBD \uCF00\uC5B4\uB97C \uC704\uD55C \uCD09\uCD09\uD55C \uB370\uC77C\uB9AC \uD06C\uB9BC.",
      desc: "\uBBFC\uAC10\uD55C \uD53C\uBD80\uB3C4 \uB9E4\uC77C \uD3B8\uC548\uD558\uAC8C \uC0AC\uC6A9\uD560 \uC218 \uC788\uB3C4\uB85D \uBB34\uAC81\uC9C0 \uC54A\uC740 \uBCF4\uC2B5\uB9C9\uC744 \uB0A8\uAE30\uB294 \uC7A5\uBCBD \uCF00\uC5B4 \uD06C\uB9BC\uC785\uB2C8\uB2E4.",
      image:
        "https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: "cos-serum",
      name: "Glass Skin Glow Serum",
      ko: "\uAE00\uB798\uC2A4 \uC2A4\uD0A8 \uAE00\uB85C\uC6B0 \uC138\uB7FC",
      category: "\uD654\uC7A5\uD488",
      type: "Skincare Serum",
      badge: "New",
      price: 42e3,
      sale: 36e3,
      option: "30ml / \uC724\uAD11 \uCF00\uC5B4",
      short:
        "\uD53C\uBD80\uACB0\uACFC \uAD11\uCC44\uB97C \uB9E4\uB044\uB7FD\uAC8C \uC815\uB3C8\uD558\uB294 \uC218\uBD84 \uC138\uB7FC.",
      desc: "\uB048\uC801\uC784 \uC5C6\uC774 \uD761\uC218\uB418\uB294 \uC6CC\uD130 \uC824 \uD14D\uC2A4\uCC98\uB85C \uD53C\uBD80\uACB0\uC744 \uC815\uB3C8\uD558\uACE0 \uC740\uC740\uD55C \uC724\uAE30\uB97C \uB354\uD574\uC8FC\uB294 \uB370\uC77C\uB9AC \uC138\uB7FC\uC785\uB2C8\uB2E4.",
      image:
        "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: "cos-lip",
      name: "Velvet Tint Balm",
      ko: "\uBCA8\uBCB3 \uD2F4\uD2B8 \uBC24",
      category: "\uD654\uC7A5\uD488",
      type: "Makeup Lip Balm",
      badge: "Hot",
      price: 24e3,
      sale: 19e3,
      option: "03 Rose Fig",
      short:
        "\uC785\uC220\uC740 \uD3B8\uC548\uD558\uAC8C, \uCEEC\uB7EC\uB294 \uBD84\uC704\uAE30 \uC788\uAC8C \uB0A8\uAE30\uB294 \uD2F4\uD2B8 \uBC24.",
      desc: "\uBC24\uCC98\uB7FC \uBD80\uB4DC\uB7FD\uAC8C \uBC1C\uB9AC\uBA74\uC11C \uC740\uC740\uD55C \uCEEC\uB7EC\uAC00 \uB0A8\uC544 \uB370\uC77C\uB9AC \uBA54\uC774\uD06C\uC5C5\uC5D0 \uC5B4\uC6B8\uB9AC\uB294 \uB9BD \uC81C\uD488\uC785\uB2C8\uB2E4.",
      image:
        "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: "cos-sun",
      name: "Daily Tone Up Sunscreen",
      ko: "\uB370\uC77C\uB9AC \uD1A4\uC5C5 \uC120\uC2A4\uD06C\uB9B0",
      category: "\uD654\uC7A5\uD488",
      type: "Sun Care SPF",
      badge: "Best",
      price: 3e4,
      sale: 25e3,
      option: "50ml / SPF50+ PA++++",
      short:
        "\uBC31\uD0C1\uC740 \uC904\uC774\uACE0 \uD53C\uBD80\uD1A4\uC740 \uC790\uC5F0\uC2A4\uB7FD\uAC8C \uC815\uB3C8\uD558\uB294 \uC120\uD06C\uB9BC.",
      desc: "\uC2A4\uD0A8\uCF00\uC5B4 \uB9C8\uC9C0\uB9C9 \uB2E8\uACC4\uC5D0\uC11C \uD53C\uBD80\uD1A4\uC744 \uC790\uC5F0\uC2A4\uB7FD\uAC8C \uBC1D\uD600\uC8FC\uACE0 \uC790\uC678\uC120 \uCC28\uB2E8\uAE4C\uC9C0 \uB3D5\uB294 \uB370\uC77C\uB9AC \uC120\uCF00\uC5B4\uC785\uB2C8\uB2E4.",
      image:
        "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=1200&q=80",
    },
  ];
  var categoryCopy = {
    미용기구: {
      benefits: [
        "\uAC04\uD3B8\uD55C \uD648\uCF00\uC5B4 \uB8E8\uD2F4",
        "\uAE54\uB054\uD55C \uB514\uC790\uC778\uACFC \uBCF4\uAD00\uC131",
        "\uCD08\uBCF4\uC790\uB3C4 \uC26C\uC6B4 \uC0AC\uC6A9\uAC10",
      ],
      material:
        "\uBBF8\uC6A9\uAE30\uAE30 \uBCF8\uCCB4, \uC804\uC6A9 \uD328\uD0A4\uC9C0, \uC0AC\uC6A9 \uC124\uBA85\uC11C",
      usage:
        "\uC138\uC548 \uB610\uB294 \uC0F4\uD478 \uD6C4 \uD544\uC694\uD55C \uBD80\uC704\uC5D0 \uBD80\uB4DC\uB7FD\uAC8C \uC0AC\uC6A9\uD558\uC138\uC694. \uC0AC\uC6A9 \uD6C4\uC5D0\uB294 \uB9C8\uB978 \uCC9C\uC73C\uB85C \uB2E6\uC544 \uBCF4\uAD00\uD569\uB2C8\uB2E4.",
      review:
        "\uB514\uC790\uC778\uC774 \uAE54\uB054\uD558\uACE0 \uC9D1\uC5D0\uC11C \uAD00\uB9AC\uD558\uAE30 \uC88B\uC544 \uB9E4\uC77C \uC190\uC774 \uAC04\uB2E4\uB294 \uBC18\uC751\uC774 \uB9CE\uC2B5\uB2C8\uB2E4.",
    },
    미용재료: {
      benefits: [
        "\uC0B4\uB871\uAE09 \uCF00\uC5B4 \uB8E8\uD2F4",
        "\uC804\uBB38\uC801\uC778 \uC0AC\uC6A9\uAC10",
        "\uD648\uCF00\uC5B4\uC640 \uB9E4\uC7A5 \uC0AC\uC6A9 \uBAA8\uB450 \uC801\uD569",
      ],
      material:
        "\uC804\uBB38 \uBBF8\uC6A9\uC7AC\uB8CC \uBCA0\uC774\uC2A4, \uBCF4\uC2B5/\uCF00\uC5B4 \uC131\uBD84, \uC804\uC6A9 \uD328\uD0A4\uC9C0",
      usage:
        "\uC81C\uD488 \uD2B9\uC131\uC5D0 \uB9DE\uAC8C \uC801\uC815\uB7C9\uC744 \uB35C\uC5B4 \uC0AC\uC6A9\uD558\uACE0, \uD544\uC694\uD55C \uACBD\uC6B0 \uCDA9\uBD84\uD788 \uD5F9\uAD88 \uB9C8\uBB34\uB9AC\uD569\uB2C8\uB2E4.",
      review:
        "\uC9D1\uC5D0\uC11C\uB3C4 \uAD00\uB9AC\uBC1B\uC740 \uB4EF\uD55C \uB290\uB08C\uC774 \uB098\uACE0 \uC0AC\uC6A9\uBC95\uC774 \uC5B4\uB835\uC9C0 \uC54A\uB2E4\uB294 \uD6C4\uAE30\uAC00 \uB9CE\uC2B5\uB2C8\uB2E4.",
    },
    화장품: {
      benefits: [
        "\uB370\uC77C\uB9AC \uBDF0\uD2F0 \uB8E8\uD2F4",
        "\uCD09\uCD09\uD558\uACE0 \uD3B8\uC548\uD55C \uC0AC\uC6A9\uAC10",
        "\uAC10\uAC01\uC801\uC778 \uD328\uD0A4\uC9C0",
      ],
      material:
        "\uBCF4\uC2B5 \uC131\uBD84, \uD53C\uBD80 \uCEE8\uB514\uC154\uB2DD \uC131\uBD84, \uC2DD\uBB3C \uC720\uB798 \uCD94\uCD9C\uBB3C",
      usage:
        "\uAE30\uCD08 \uB8E8\uD2F4 \uB610\uB294 \uBA54\uC774\uD06C\uC5C5 \uB2E8\uACC4\uC5D0 \uB9DE\uCDB0 \uC801\uB2F9\uB7C9\uC744 \uBD80\uB4DC\uB7FD\uAC8C \uD3B4 \uBC1C\uB77C\uC8FC\uC138\uC694.",
      review:
        "\uBC1C\uB9BC\uC131\uC774 \uC88B\uACE0 \uB9E4\uC77C \uC4F0\uAE30 \uBD80\uB2F4 \uC5C6\uB294 \uC81C\uD488\uC774\uB77C\uB294 \uBC18\uC751\uC774 \uB9CE\uC2B5\uB2C8\uB2E4.",
    },
  };

  // scripts/data/demo-store.js
  var STORE_KEY = "beauty-ref-demo-store-v1";
  var DB_NAME = "beauty-ref-local-db";
  var DB_VERSION = 1;
  var DB_STORE = "app-state";
  var DB_STATE_KEY = "store";
  var defaultStore = {
    currentMemberId: "",
    settings: {
      purchasePointRate: 5,
      maxPointUseRate: 50,
      friendSignupPoint: 3e3,
      personalReferrerRewardRate: 10,
      personalBuyerBonusRate: 5,
    },
    products: products.map((product, index) => ({
      ...product,
      detailImages: normalizeDetailImages(product),
      sku: product.id.toUpperCase().replace(/[^A-Z0-9]/g, "-"),
      status: "selling",
      displayStatus: "displayed",
      stock: 100 - index * 3,
      safetyStock: 5,
      supplyPrice: Math.floor(product.sale * 0.65),
      cost: Math.floor(product.sale * 0.55),
      taxType: "taxable",
      shippingType: "default",
      shippingFee: 3e3,
      pointRateOverride: "",
      manufacturer: "BEAUTY REF.",
      supplier: "\uBCF8\uC0AC \uBB3C\uB958",
      origin: "Korea",
      brand: "BEAUTY REF.",
      barcode: "",
      searchKeywords: `${product.name}, ${product.ko}, ${product.category}`,
      variants: [
        {
          id: `${product.id}-default`,
          optionName: product.option,
          sku: `${product.id.toUpperCase().replace(/[^A-Z0-9]/g, "-")}-STD`,
          priceDelta: 0,
          stock: 100 - index * 3,
          status: "selling",
        },
      ],
    })),
    agencies: [
      {
        id: "agency-hq",
        name: "\uBCF8\uC0AC",
        code: "HQ",
        linkSlug: "hq",
        commissionRate: 0,
        status: "active",
        isHeadquarters: true,
        contractStart: "2026-01-01",
        contractEnd: "",
        managerName: "\uBCF8\uC0AC",
        managerPhone: "02-0000-0000",
        settlementAccount: "\uBCF8\uC0AC \uB0B4\uBD80 \uC815\uC0B0",
        loginUserId: "",
        loginPasswordHash: "",
      },
      {
        id: "agency-gangnam",
        name: "\uAC15\uB0A8 \uBDF0\uD2F0 \uB300\uB9AC\uC810",
        code: "GNBEAUTY",
        linkSlug: "gangnam-beauty",
        commissionRate: 12,
        status: "active",
        isHeadquarters: false,
        contractStart: "2026-05-01",
        contractEnd: "",
        managerName: "\uAE40\uB2F4\uB2F9",
        managerPhone: "010-1111-2222",
        settlementAccount:
          "\uD14C\uC2A4\uD2B8\uC740\uD589 123-456-789 \uD64D\uAE38\uB3D9",
        loginUserId: "gangnam01",
        loginPasswordHash: "fdc96a92",
      },
    ],
    members: [
      {
        id: "member-a",
        userId: "beauty01",
        passwordHash: "9a92be01",
        authProvider: "password",
        name: "\uD64D\uAE38\uB3D9",
        phone: "010-0000-0000",
        email: "beauty@example.com",
        agencyId: "agency-gangnam",
        role: "agency_manager",
        points: 18e3,
        status: "active",
        joinedAt: "2026-05-29",
        address: {
          postcode: "06236",
          address:
            "\uC11C\uC6B8\uC2DC \uAC15\uB0A8\uAD6C \uD14C\uD5E4\uB780\uB85C 000",
          addressDetail: "",
        },
        shippingAddresses: [
          {
            id: "addr-member-a-default",
            label: "\uAE30\uBCF8 \uBC30\uC1A1\uC9C0",
            recipient: "\uD64D\uAE38\uB3D9",
            phone: "010-0000-0000",
            postcode: "06236",
            address:
              "\uC11C\uC6B8\uC2DC \uAC15\uB0A8\uAD6C \uD14C\uD5E4\uB780\uB85C 000",
            addressDetail: "",
            isDefault: true,
          },
        ],
      },
    ],
    orders: [
      {
        id: "order-001",
        memberId: "member-a",
        agencyIdAtOrder: "agency-gangnam",
        referralSourceType: "none",
        paidProductAmount: 76e3,
        shippingAmount: 0,
        paidAmount: 76e3,
        pointUsed: 0,
        pointUseLimit: 18e3,
        pointEarned: 3800,
        status: "paid",
        shippingStatus: "preparing",
        courier: "",
        trackingNumber: "",
        shippedAt: "",
        deliveredAt: "",
        shippingMemo:
          "\uACB0\uC81C \uD655\uC778 \uD6C4 \uCD9C\uACE0 \uC900\uBE44",
        shippingAddress: {
          recipient: "\uD64D\uAE38\uB3D9",
          phone: "010-0000-0000",
          postcode: "06236",
          address:
            "\uC11C\uC6B8\uC2DC \uAC15\uB0A8\uAD6C \uD14C\uD5E4\uB780\uB85C 000",
          addressDetail: "",
        },
        paymentMethod: "\uC2E0\uC6A9\uCE74\uB4DC",
        paidAt: "2026-05-29",
        items: [
          {
            productId: "device-led",
            productName: "LED Skin Lifting Device",
            productKo:
              "LED \uC2A4\uD0A8 \uB9AC\uD504\uD305 \uB514\uBC14\uC774\uC2A4",
            sale: 76e3,
            qty: 1,
            option: "1ea / Warm White",
          },
        ],
      },
    ],
    pointLedger: [
      {
        id: "point-001",
        memberId: "member-a",
        orderId: "order-001",
        type: "purchase_earn",
        amount: 3800,
        baseAmount: 76e3,
        rate: 5,
        note: "\uBC30\uC1A1\uBE44 \uC81C\uC678 \uC2E4\uACB0\uC81C \uC0C1\uD488\uAE08\uC561 \uAE30\uC900 \uAD6C\uB9E4 \uC801\uB9BD",
        createdAt: "2026-05-29",
      },
    ],
    agencySettlementLedger: [
      {
        id: "agency-settlement-001",
        agencyId: "agency-gangnam",
        orderId: "order-001",
        baseAmount: 76e3,
        commissionRate: 12,
        commissionAmount: 9120,
        status: "pending_next_month_15",
        updatedAt: "",
        statusUpdatedBy: "",
        statusNote: "",
        statusHistory: [],
        note: "\uAC1C\uC778 \uCD94\uCC9C\uB9C1\uD06C \uAD6C\uB9E4\uAC00 \uC544\uB2C8\uBBC0\uB85C \uB300\uB9AC\uC810 \uC804\uC6D4 \uB9E4\uCD9C \uC815\uC0B0 \uB300\uC0C1",
        createdAt: "2026-05-29",
      },
    ],
    personalReferralLinks: [
      {
        id: "ref-led-001",
        ownerMemberId: "member-a",
        productId: "device-led",
        orderId: "order-001",
        unitIndex: 1,
        code: "LED-A-001",
        status: "active",
      },
    ],
  };
  function normalizeDetailImages(product) {
    if (Array.isArray(product.detailImages) && product.detailImages.length) {
      return product.detailImages.slice(0, 5);
    }
    return [product.image].filter(Boolean);
  }
  function cloneDefaultStore() {
    return JSON.parse(JSON.stringify(defaultStore));
  }
  function getStorage() {
    try {
      return globalThis.localStorage;
    } catch (e) {
      return null;
    }
  }
  async function loadStore() {
    var _a, _b;
    const serverStore = await loadStoreFromServer();
    if (serverStore) {
      const localStore = await getBestLocalStore();
      const mergedProductStore = mergeLocalProductsIntoServer(
        serverStore,
        localStore,
      );
      const shouldMigrate = shouldMigrateLocalStoreToServer(
        mergedProductStore,
        localStore,
      );
      const snapshot = shouldMigrate
        ? normalizeStore(localStore)
        : normalizeStore(mergedProductStore);
      if (shouldMigrate || mergedProductStore !== serverStore) {
        await saveStoreToServer(snapshot);
      }
      (_a = getStorage()) == null
        ? void 0
        : _a.setItem(STORE_KEY, JSON.stringify(snapshot));
      await saveStoreToDatabase(snapshot);
      return snapshot;
    }
    const databaseStore = await loadStoreFromDatabase();
    if (databaseStore) {
      const snapshot = normalizeStore(databaseStore);
      (_b = getStorage()) == null
        ? void 0
        : _b.setItem(STORE_KEY, JSON.stringify(snapshot));
      return snapshot;
    }
    const legacyStore = loadStoreFromLegacyStorage();
    await saveStore(legacyStore);
    return normalizeStore(legacyStore);
  }
  async function saveStore(store) {
    var _a;
    const snapshot = normalizeStore(store);
    (_a = getStorage()) == null
      ? void 0
      : _a.setItem(STORE_KEY, JSON.stringify(snapshot));
    if (await saveStoreToServer(snapshot)) return;
    await saveStoreToDatabase(snapshot);
  }
  function loadStoreFromLegacyStorage() {
    const storage = getStorage();
    const saved = storage == null ? void 0 : storage.getItem(STORE_KEY);
    if (!saved) return cloneDefaultStore();
    try {
      return { ...cloneDefaultStore(), ...JSON.parse(saved) };
    } catch (e) {
      return cloneDefaultStore();
    }
  }
  async function getBestLocalStore() {
    const databaseStore = await loadStoreFromDatabase();
    const legacyStore = loadStoreFromLegacyStorage();
    if (getStoreWeight(databaseStore) >= getStoreWeight(legacyStore)) {
      return databaseStore;
    }
    return legacyStore;
  }
  function shouldMigrateLocalStoreToServer(serverStore, localStore) {
    if (!localStore) return false;
    return getStoreWeight(localStore) > getStoreWeight(serverStore);
  }
  function mergeLocalProductsIntoServer(serverStore, localStore) {
    var _a;
    if (
      !((_a = localStore == null ? void 0 : localStore.products) == null
        ? void 0
        : _a.length)
    )
      return serverStore;
    const serverSnapshot = normalizeStore(serverStore);
    const localSnapshot = normalizeStore(localStore);
    const serverProductIds = new Set(
      serverSnapshot.products.map((product) => product.id),
    );
    const missingProducts = localSnapshot.products.filter(
      (product) => !serverProductIds.has(product.id),
    );
    if (!missingProducts.length) return serverStore;
    return {
      ...serverSnapshot,
      products: [...serverSnapshot.products, ...missingProducts],
    };
  }
  function getStoreWeight(store) {
    if (!store) return 0;
    const snapshot = normalizeStore(store);
    return (
      snapshot.members.length * 10 +
      snapshot.orders.length * 8 +
      snapshot.pointLedger.length * 5 +
      snapshot.agencySettlementLedger.length * 4 +
      snapshot.personalReferralLinks.length * 3 +
      snapshot.products.length * 2 +
      snapshot.agencies.length +
      (snapshot.currentMemberId ? 2 : 0) +
      (snapshot.pendingAgencySlug ? 1 : 0)
    );
  }
  function normalizeStore(store) {
    return {
      ...cloneDefaultStore(),
      ...store,
      settings: {
        ...cloneDefaultStore().settings,
        ...(store == null ? void 0 : store.settings),
      },
      agencies:
        (store == null ? void 0 : store.agencies) ||
        cloneDefaultStore().agencies,
      products:
        (store == null ? void 0 : store.products) ||
        cloneDefaultStore().products,
      members:
        (store == null ? void 0 : store.members) || cloneDefaultStore().members,
      orders:
        (store == null ? void 0 : store.orders) || cloneDefaultStore().orders,
      pointLedger:
        (store == null ? void 0 : store.pointLedger) ||
        cloneDefaultStore().pointLedger,
      agencySettlementLedger:
        (store == null ? void 0 : store.agencySettlementLedger) ||
        cloneDefaultStore().agencySettlementLedger,
      personalReferralLinks:
        (store == null ? void 0 : store.personalReferralLinks) ||
        cloneDefaultStore().personalReferralLinks,
    };
  }
  async function loadStoreFromServer() {
    if (!shouldUseServerStore()) return null;
    try {
      const response = await fetchWithTimeout("/api/store", {
        method: "GET",
        headers: { Accept: "application/json" },
      });
      if (!response.ok) return null;
      return response.json();
    } catch (e) {
      return null;
    }
  }
  async function saveStoreToServer(store) {
    if (!shouldUseServerStore()) return false;
    try {
      const response = await fetchWithTimeout("/api/store", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(store),
      });
      return response.ok;
    } catch (e) {
      return false;
    }
  }
  function shouldUseServerStore() {
    var _a;
    const browserWindow = globalThis.window || null;
    return Boolean(
      browserWindow &&
      !browserWindow.__BEAUTY_DISABLE_SERVER_STORE &&
      ((_a = browserWindow.location) == null ? void 0 : _a.protocol) !==
        "file:" &&
      browserWindow.fetch,
    );
  }
  function fetchWithTimeout(url, options = {}) {
    const browserWindow = globalThis.window;
    const controller = new AbortController();
    const timeout = browserWindow.setTimeout(() => controller.abort(), 800);
    return browserWindow
      .fetch(url, { ...options, signal: controller.signal })
      .finally(() => browserWindow.clearTimeout(timeout));
  }
  async function loadStoreFromDatabase() {
    const database = await openDatabase();
    if (!database) return null;
    return new Promise((resolve) => {
      const transaction = database.transaction(DB_STORE, "readonly");
      const request = transaction.objectStore(DB_STORE).get(DB_STATE_KEY);
      request.onsuccess = () => {
        var _a;
        return resolve(
          ((_a = request.result) == null ? void 0 : _a.value) || null,
        );
      };
      request.onerror = () => resolve(null);
    });
  }
  async function saveStoreToDatabase(store) {
    const database = await openDatabase();
    if (!database) return;
    await new Promise((resolve) => {
      const transaction = database.transaction(DB_STORE, "readwrite");
      transaction.objectStore(DB_STORE).put({
        id: DB_STATE_KEY,
        value: store,
        updatedAt: /* @__PURE__ */ new Date().toISOString(),
      });
      transaction.oncomplete = resolve;
      transaction.onerror = resolve;
    });
  }
  function openDatabase() {
    if (!globalThis.indexedDB) return Promise.resolve(null);
    return new Promise((resolve) => {
      const request = globalThis.indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => {
        const database = request.result;
        if (!database.objectStoreNames.contains(DB_STORE)) {
          database.createObjectStore(DB_STORE, { keyPath: "id" });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
    });
  }

  // scripts/utils/format.js
  var formatMoney = (value) => `${Number(value).toLocaleString("ko-KR")}\uC6D0`;

  // scripts/ui/auth.js
  function createAuthController({
    dom,
    store,
    persistStore,
    updateSessionUi = () => {},
    showHome,
    closeCart,
    showToast,
  }) {
    migrateMemberAuthDefaults();
    const ADDRESS_LOOKUP_PRESETS = [
      {
        label: "\uAC15\uB0A8 \uC1FC\uB8F8",
        postcode: "06236",
        address:
          "\uC11C\uC6B8\uC2DC \uAC15\uB0A8\uAD6C \uD14C\uD5E4\uB780\uB85C 000",
      },
      {
        label: "\uC131\uC218 \uBB3C\uB958\uC13C\uD130",
        postcode: "04783",
        address:
          "\uC11C\uC6B8\uC2DC \uC131\uB3D9\uAD6C \uC5F0\uBB34\uC7A5\uAE38 00",
      },
      {
        label: "\uB9C8\uD3EC \uC0AC\uBB34\uC2E4",
        postcode: "04157",
        address: "\uC11C\uC6B8\uC2DC \uB9C8\uD3EC\uAD6C \uC591\uD654\uB85C 00",
      },
      {
        label: "\uBD80\uC0B0 \uC13C\uD140\uC810",
        postcode: "48059",
        address:
          "\uBD80\uC0B0\uC2DC \uD574\uC6B4\uB300\uAD6C \uC13C\uD140\uC911\uC559\uB85C 00",
      },
    ];
    function openAuth(mode = "login") {
      closeCart();
      dom.auth.innerHTML = createAuthView(mode);
      showAuthView();
      bindAuthEvents();
    }
    function closeAuth() {
      dom.auth.classList.add("is-hidden");
      dom.auth.innerHTML = "";
      document.body.classList.remove("modal-open");
    }
    function openProfile() {
      const member = getCurrentMember2();
      if (!member) {
        openAuth("login");
        return;
      }
      closeCart();
      dom.auth.innerHTML = createProfileView(member);
      showAuthView();
      bindProfileEvents();
    }
    function openManagementLogin(role, onSuccess = () => {}) {
      closeCart();
      dom.auth.innerHTML = createManagementLoginView(role);
      showAuthView();
      bindManagementLoginEvents(role, onSuccess);
    }
    function createAuthView(mode) {
      const modeLabel = {
        login: "\uB85C\uADF8\uC778",
        signup: "\uD68C\uC6D0\uAC00\uC785",
        complete: "Welcome",
      };
      return `
    <section class="auth-dialog" role="dialog" aria-modal="true" aria-label="${modeLabel[mode]}">
      <button class="cart-close auth-close" id="authClose" type="button" aria-label="\uD68C\uC6D0 \uD31D\uC5C5 \uB2EB\uAE30">\xD7</button>
      <section class="auth-card">
        <div class="auth-tabs" aria-label="\uD68C\uC6D0 \uBA54\uB274">
          ${createAuthTab("login", "\uB85C\uADF8\uC778", mode)}
          ${createAuthTab("signup", "\uD68C\uC6D0\uAC00\uC785", mode)}
        </div>
        <div class="auth-mode-label">${modeLabel[mode]}</div>
        ${createAuthPanel(mode)}
        ${mode !== "complete" ? createManagementAccess() : ""}
      </section>
    </section>
  `;
    }
    function createAuthTab(mode, label, activeMode) {
      return `<button class="auth-tab ${mode === activeMode ? "is-active" : ""}" data-auth-mode="${mode}">${label}</button>`;
    }
    function createAuthPanel(mode) {
      if (mode === "signup") return createSignupPanel();
      if (mode === "complete") return createAuthCompletePanel();
      return createLoginPanel();
    }
    function createSignupPanel() {
      return `
    <div class="signup-grid">
      <section class="signup-simple auth-panel">
        <div class="auth-intro">
          <strong>\uAC04\uD3B8\uD68C\uC6D0\uAC00\uC785</strong>
          <p>\uC790\uC8FC \uC0AC\uC6A9\uD558\uB294 \uACC4\uC815\uC73C\uB85C \uBE60\uB974\uAC8C \uAC00\uC785\uD558\uC138\uC694. \uBC84\uD2BC \uD074\uB9AD \uC2DC \uC644\uB8CC \uD654\uBA74\uC73C\uB85C \uC774\uB3D9\uD569\uB2C8\uB2E4.</p>
        </div>
        <div class="social-stack">
          ${createSocialButton("kakao", "\uCE74\uCE74\uC624\uB85C \uD68C\uC6D0\uAC00\uC785", "\u25CF")}
          ${createSocialButton("naver", "\uB124\uC774\uBC84\uB85C \uD68C\uC6D0\uAC00\uC785", "N")}
          ${createSocialButton("apple", "Apple\uB85C \uACC4\uC18D\uD558\uAE30", "\uF8FF")}
        </div>
      </section>
      <section class="signup-general">
        ${createGeneralSignupPanel()}
      </section>
    </div>
  `;
    }
    function createGeneralSignupPanel() {
      const pendingAgency = getPendingAgency();
      return `
    <form class="auth-form" data-auth-form="signup">
      <label>\uC544\uC774\uB514<input class="quantity-input" name="userId" placeholder="beauty01" /></label>
      <label>\uBE44\uBC00\uBC88\uD638<input class="quantity-input" name="password" type="password" placeholder="\uC601\uBB38+\uC22B\uC790 8\uC790 \uC774\uC0C1" /></label>
      <label>\uC774\uB984<input class="quantity-input" name="name" placeholder="\uD64D\uAE38\uB3D9" /></label>
      <label>\uD734\uB300\uD3F0<input class="quantity-input" name="phone" placeholder="010-0000-0000" /></label>
      <label>\uC774\uBA54\uC77C<input class="quantity-input" name="email" placeholder="beauty@example.com" /></label>
      <label>\uB300\uB9AC\uC810\uCF54\uB4DC<input class="quantity-input" name="agencyCode" value="${(pendingAgency == null ? void 0 : pendingAgency.code) || ""}" placeholder="\uC608: GNBEAUTY" /></label>
      ${createAddressFields()}
      <label class="auth-check"><input type="checkbox" checked /> \uBDF0\uD2F0 \uD61C\uD0DD \uBC0F \uCCAB \uAD6C\uB9E4 \uCFE0\uD3F0 \uC548\uB0B4 \uBC1B\uAE30</label>
      <button class="buy-button auth-submit" type="submit">\uC77C\uBC18\uD68C\uC6D0\uAC00\uC785 \uC644\uB8CC</button>
      <p class="auth-error" data-auth-error aria-live="polite"></p>
      <p class="auth-note">\uB300\uB9AC\uC810\uCF54\uB4DC\uAC00 \uC5C6\uAC70\uB098 \uC77C\uCE58\uD558\uC9C0 \uC54A\uC73C\uBA74 \uBCF8\uC0AC \uB300\uB9AC\uC810 \uACE0\uAC1D\uC73C\uB85C \uB4F1\uB85D\uB429\uB2C8\uB2E4.</p>
    </form>
  `;
    }
    function createLoginPanel() {
      return `
    <form class="auth-form login-form" data-auth-form="login">
      <div class="login-section-title">\uC77C\uBC18 \uB85C\uADF8\uC778</div>
      <div class="login-box">
        <div class="login-visual" aria-hidden="true">
          <span></span>
        </div>
        <div class="login-fields">
          <label class="sr-only" for="loginUserId">\uC544\uC774\uB514</label>
          <input class="quantity-input" id="loginUserId" name="userId" placeholder="\uC544\uC774\uB514\uB97C \uC785\uB825\uD558\uC138\uC694." />
          <label class="sr-only" for="loginPassword">\uBE44\uBC00\uBC88\uD638</label>
          <input class="quantity-input" id="loginPassword" name="password" type="password" placeholder="\uBE44\uBC00\uBC88\uD638\uB97C \uC785\uB825\uD558\uC138\uC694." />
        </div>
        <button class="buy-button login-submit" type="submit">\uB85C\uADF8\uC778</button>
      </div>
      <div class="login-options">
        <label class="login-save"><input type="checkbox" /> \uC544\uC774\uB514 \uC800\uC7A5</label>
        <div>
          <button type="button" data-auth-complete="\uC544\uC774\uB514 \uCC3E\uAE30">\uC544\uC774\uB514 \uCC3E\uAE30</button>
          <span>|</span>
          <button type="button" data-auth-complete="\uBE44\uBC00\uBC88\uD638 \uCC3E\uAE30">\uBE44\uBC00\uBC88\uD638 \uCC3E\uAE30</button>
        </div>
      </div>
      <div class="quick-login-row">
        ${createSocialButton("kakao", "\uCE74\uCE74\uC624 \uB85C\uADF8\uC778", "\u25CF")}
        ${createSocialButton("naver", "\uB124\uC774\uBC84 \uB85C\uADF8\uC778", "N")}
        ${createSocialButton("apple", "Apple \uB85C\uADF8\uC778", "\uF8FF")}
        ${createSocialButton("google", "Google \uB85C\uADF8\uC778", "G")}
      </div>
      <div class="signup-callout">
        <div>
          <strong>\uC7A0\uAE50! \uC544\uC9C1 \uD68C\uC6D0\uC774 \uC544\uB2C8\uC2E0\uAC00\uC694?</strong>
          <p>\uCCAB \uAD6C\uB9E4 \uCFE0\uD3F0\uACFC \uD68C\uC6D0 \uC804\uC6A9 \uD61C\uD0DD\uC744 \uBC1B\uC744 \uC218 \uC788\uC2B5\uB2C8\uB2E4.</p>
        </div>
        <button class="buy-button" type="button" data-auth-mode="signup">\uD68C\uC6D0\uAC00\uC785</button>
      </div>
      <p class="auth-error" data-auth-error aria-live="polite"></p>
      <p class="auth-note">\uD68C\uC6D0\uAC00\uC785\uD55C \uC544\uC774\uB514\uC640 \uBE44\uBC00\uBC88\uD638\uAC00 \uC77C\uCE58\uD574\uC57C \uB85C\uADF8\uC778\uB429\uB2C8\uB2E4.</p>
    </form>
  `;
    }
    function createAuthCompletePanel() {
      const member = getCurrentMember2();
      return `
    <div class="auth-complete">
      <div class="auth-mark">B</div>
      <h2>\uAC00\uC785/\uB85C\uADF8\uC778\uC774 \uC644\uB8CC\uB418\uC5C8\uC2B5\uB2C8\uB2E4.</h2>
      <p>${(member == null ? void 0 : member.name) || "\uD68C\uC6D0"}\uB2D8, \uC1FC\uD551\uC744 \uACC4\uC18D \uC9C4\uD589\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.</p>
      <button class="buy-button auth-submit" id="authGoShop">Shop \uBCF4\uB7EC\uAC00\uAE30</button>
    </div>
  `;
    }
    function createManagementAccess() {
      return `
    <div class="auth-management" aria-label="\uAD00\uB9AC \uBA54\uB274">
      <a href="#admin" data-management-link="admin">Admin</a>
      <a href="#agency" data-management-link="agency">Agency</a>
    </div>
  `;
    }
    function createManagementLoginView(role) {
      const isAdmin = role === "admin";
      const title = isAdmin ? "Admin Login" : "Agency Login";
      const label = isAdmin
        ? "\uAD00\uB9AC\uC790 \uB85C\uADF8\uC778"
        : "\uB300\uB9AC\uC810 \uB85C\uADF8\uC778";
      const note = isAdmin
        ? "\uAD00\uB9AC\uC790 \uC804\uC6A9 \uC544\uC774\uB514\uC640 \uBE44\uBC00\uBC88\uD638\uB85C \uC811\uC18D\uD569\uB2C8\uB2E4."
        : "Admin\uC5D0\uC11C \uBC1C\uAE09\uD55C \uB300\uB9AC\uC810\uBCC4 \uC544\uC774\uB514\uC640 \uBE44\uBC00\uBC88\uD638\uB85C \uC811\uC18D\uD569\uB2C8\uB2E4.";
      const defaultUserId = isAdmin ? "adminChang" : "";
      const defaultPassword = isAdmin ? "Chang$0909" : "";
      return `
    <section class="auth-dialog" role="dialog" aria-modal="true" aria-label="${label}">
      <button class="cart-close auth-close" id="authClose" type="button" aria-label="${label} \uB2EB\uAE30">\xD7</button>
      <section class="auth-card management-login-card">
        <div class="profile-head">
          <div>
            <div class="product-category">${title}</div>
            <h2>${label}</h2>
          </div>
          <p>${note}</p>
        </div>
        <form class="auth-form login-form" data-management-login="${role}">
          <div class="login-box">
            <div class="login-visual" aria-hidden="true"><span></span></div>
            <div class="login-fields">
              <label class="sr-only" for="managementUserId">\uC544\uC774\uB514</label>
              <input class="quantity-input" id="managementUserId" name="userId" value="${defaultUserId}" placeholder="\uC544\uC774\uB514\uB97C \uC785\uB825\uD558\uC138\uC694." />
              <label class="sr-only" for="managementPassword">\uBE44\uBC00\uBC88\uD638</label>
              <input class="quantity-input" id="managementPassword" name="password" type="password" value="${defaultPassword}" placeholder="\uBE44\uBC00\uBC88\uD638\uB97C \uC785\uB825\uD558\uC138\uC694." />
            </div>
            <button class="buy-button login-submit" type="submit">${label}</button>
          </div>
          <p class="auth-error" data-auth-error aria-live="polite"></p>
          <p class="auth-note">${note}</p>
        </form>
        ${createManagementAccess()}
      </section>
    </section>
  `;
    }
    function createSocialButton(provider, label, mark) {
      return `
    <button class="social-button social-${provider}" type="button" data-auth-complete="${label}">
      <span>${mark}</span>${label}
    </button>
  `;
    }
    function createAddressFields() {
      return `
    <div class="address-box">
      <div class="address-title">\uC120\uD0DD \uBC30\uC1A1\uC9C0</div>
      <div class="quantity-row">
        <label>\uC6B0\uD3B8\uBC88\uD638<input class="quantity-input" name="postcode" placeholder="06236" /></label>
        <button class="cart-button address-search" type="button" data-address-search>\uBC30\uC1A1\uC9C0 \uC870\uD68C</button>
      </div>
      ${createAddressLookupPanel()}
      <label>\uBC30\uC1A1\uC9C0<input class="quantity-input" name="address" placeholder="\uC11C\uC6B8\uC2DC \uAC15\uB0A8\uAD6C \uD14C\uD5E4\uB780\uB85C 000" /></label>
      <label>\uC0C1\uC138\uC8FC\uC18C<input class="quantity-input" name="addressDetail" placeholder="\uB3D9/\uD638\uC218 \uB610\uB294 \uC694\uCCAD\uC0AC\uD56D" /></label>
    </div>
  `;
    }
    function createAddressLookupPanel(prefix = "") {
      return `
    <div class="address-lookup-panel is-hidden" data-address-panel="${prefix}">
      <div class="address-lookup-head">
        <strong>\uBC30\uC1A1\uC9C0 \uC870\uD68C \uACB0\uACFC</strong>
        <span>\uC8FC\uC18C\uB97C \uC120\uD0DD\uD558\uBA74 \uC6B0\uD3B8\uBC88\uD638\uC640 \uBC30\uC1A1\uC9C0\uAC00 \uC790\uB3D9 \uC785\uB825\uB429\uB2C8\uB2E4.</span>
      </div>
      <div class="address-lookup-list">
        ${ADDRESS_LOOKUP_PRESETS.map(
          (item) => `
          <button class="address-result-button" type="button" data-address-result data-address-prefix="${prefix}" data-postcode="${item.postcode}" data-address="${escapeAttribute2(item.address)}">
            <strong>${item.label}</strong>
            <span>${item.postcode} ${item.address}</span>
          </button>
        `,
        ).join("")}
      </div>
    </div>
  `;
    }
    function createProfileView(member) {
      var _a, _b, _c, _d;
      const orders = store.orders.filter(
        (order) => order.memberId === member.id,
      );
      const points = store.pointLedger.filter(
        (point) => point.memberId === member.id,
      );
      const links = store.personalReferralLinks.filter(
        (link) => link.ownerMemberId === member.id,
      );
      const stats = createProfileStats({ member, orders, points, links });
      const extraAddress =
        (member.shippingAddresses || []).find(
          (address) => !address.isDefault,
        ) || {};
      return `
    <section class="auth-dialog profile-dialog" role="dialog" aria-modal="true" aria-label="\uB0B4\uC815\uBCF4">
      <button class="cart-close auth-close" id="profileClose" type="button" aria-label="\uB0B4\uC815\uBCF4 \uB2EB\uAE30">\xD7</button>
      <section class="auth-card profile-card">
        <div class="profile-service-head">
          <div class="profile-member-main">
            <div class="profile-avatar" aria-hidden="true">${escapeHtml(createMemberInitial(member))}</div>
            <div class="profile-identity">
              <div class="product-category">Member / My page</div>
              <h2>${escapeHtml(member.name || member.userId || "\uD68C\uC6D0")}\uB2D8</h2>
              <p>
                ${member.joinedAt || "\uAC00\uC785\uC77C \uC5C6\uC74C"} \uAC00\uC785 \xB7
                ${createMemberStatusLabel(member.status)}
              </p>
            </div>
          </div>
          <div class="profile-quick-actions">
            <button class="buy-button" type="button" data-profile-close>\uB2EB\uAE30</button>
          </div>
        </div>
        <section class="profile-wallet-overview">
          <div class="profile-wallet-main">
            <span>\uC0AC\uC6A9 \uAC00\uB2A5 \uD3EC\uC778\uD2B8</span>
            <strong>${member.points.toLocaleString("ko-KR")}P</strong>
            <em>\uC774\uBC88\uB2EC \uC801\uB9BD ${stats.monthEarned.toLocaleString("ko-KR")}P \xB7 \uC0AC\uC6A9 ${stats.monthUsed.toLocaleString("ko-KR")}P</em>
          </div>
          <div class="profile-next-action">
            <span>\uCD5C\uADFC \uC8FC\uBB38</span>
            <strong>${((_a = stats.latestOrder) == null ? void 0 : _a.id) || "\uC8FC\uBB38 \uC5C6\uC74C"}</strong>
            <em>${stats.latestOrder ? `${stats.latestOrder.paidAt} \xB7 ${formatMoney(stats.latestOrder.paidAmount)}` : "\uCCAB \uC8FC\uBB38\uC744 \uAE30\uB2E4\uB9AC\uACE0 \uC788\uC2B5\uB2C8\uB2E4."}</em>
          </div>
        </section>
        <nav class="profile-top-nav" aria-label="\uB0B4\uC815\uBCF4 \uBA54\uB274">
          ${createProfileTabButton("account", "\uACC4\uC815/\uBC30\uC1A1\uC9C0", true)}
          ${createProfileTabButton("orders", "\uAD6C\uB9E4 \uB0B4\uC5ED", false)}
          ${createProfileTabButton("points", "\uD3EC\uC778\uD2B8 \uAD00\uB9AC", false)}
          ${createProfileTabButton("links", "\uCD94\uCC9C \uB9C1\uD06C", false)}
          ${createProfileTabButton("security", "\uBCF4\uC548", false)}
        </nav>
        <div class="profile-summary-grid">
          <button type="button" data-profile-section="orders" data-profile-tab="orders"><span>\uC8FC\uBB38</span><strong>${orders.length}\uAC74</strong><em>\uB204\uC801 ${formatMoney(stats.totalPaid)}</em></button>
          <button type="button" data-profile-section="points" data-profile-tab="points"><span>\uD3EC\uC778\uD2B8</span><strong>${member.points.toLocaleString("ko-KR")}P</strong><em>\uCD1D \uC0AC\uC6A9 ${stats.usedPoints.toLocaleString("ko-KR")}P</em></button>
          <button type="button" data-profile-section="links" data-profile-tab="links"><span>\uCD94\uCC9C</span><strong>${links.length}\uAC1C</strong><em>\uD65C\uC131 ${stats.activeLinks}\uAC1C</em></button>
          <div class="profile-status-card"><span>\uC774\uBC88\uB2EC</span><strong>${formatMoney(stats.monthPaid)}</strong><em>${stats.monthOrderCount}\uAC74 \uACB0\uC81C</em></div>
        </div>
        <div class="profile-service-layout">
          <div class="profile-tab-panels">
            <section class="profile-tab-panel" data-profile-panel="account">
              <div class="profile-section-head">
                <div>
                  <div class="product-category">Account</div>
                  <h3>\uACC4\uC815\uACFC \uBC30\uC1A1\uC9C0</h3>
                </div>
                <p>\uC544\uC774\uB514\uB294 \uBCC0\uACBD\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4. \uC8FC\uBB38\uACFC \uBC30\uC1A1\uC5D0 \uD544\uC694\uD55C \uAE30\uBCF8 \uC815\uBCF4\uB97C \uAD00\uB9AC\uD569\uB2C8\uB2E4.</p>
              </div>
              <form class="profile-form" data-profile-form>
                <div class="profile-form-stack">
                  <section class="profile-field-card profile-field-card--primary">
                    <div class="profile-field-title">
                      <span>\uAE30\uBCF8 \uC815\uBCF4</span>
                      <em>\uB85C\uADF8\uC778 \uC544\uC774\uB514\uB294 \uBCC0\uACBD\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.</em>
                    </div>
                    <div class="profile-form-grid">
                      <label>\uC544\uC774\uB514<input class="quantity-input" name="userId" value="${escapeAttribute2(member.userId || member.id)}" readonly /></label>
                      <label>\uC774\uB984<input class="quantity-input" name="name" value="${escapeAttribute2(member.name)}" /></label>
                      <label>\uD734\uB300\uD3F0<input class="quantity-input" name="phone" value="${escapeAttribute2(member.phone)}" /></label>
                      <label>\uC774\uBA54\uC77C<input class="quantity-input" name="email" value="${escapeAttribute2(member.email)}" /></label>
                    </div>
                  </section>

                  <section class="profile-field-card">
                    <div class="profile-field-title">
                      <span>\uAE30\uBCF8 \uBC30\uC1A1\uC9C0</span>
                      <em>\uC8FC\uBB38\uC11C\uC5D0 \uC6B0\uC120 \uC801\uC6A9\uB418\uB294 \uBC30\uC1A1 \uC815\uBCF4\uC785\uB2C8\uB2E4.</em>
                    </div>
                    <div class="profile-form-grid profile-address-grid">
                      <label>\uC6B0\uD3B8\uBC88\uD638
                        <span class="address-input-pair">
                          <input class="quantity-input" name="postcode" value="${escapeAttribute2((_b = member.address) == null ? void 0 : _b.postcode)}" />
                          <button class="cart-button address-search" type="button" data-address-search>\uC870\uD68C</button>
                        </span>
                      </label>
                      <label class="profile-wide">\uBC30\uC1A1\uC9C0<input class="quantity-input" name="address" value="${escapeAttribute2((_c = member.address) == null ? void 0 : _c.address)}" /></label>
                      <label class="profile-wide">\uC0C1\uC138\uC8FC\uC18C<input class="quantity-input" name="addressDetail" value="${escapeAttribute2((_d = member.address) == null ? void 0 : _d.addressDetail)}" /></label>
                      <div class="profile-address-lookup">${createAddressLookupPanel()}</div>
                    </div>
                  </section>

                  <div class="profile-field-split">
                    <section class="profile-field-card profile-address-overview">
                      <div class="profile-field-title">
                        <span>\uBC30\uC1A1\uC9C0 \uBAA9\uB85D</span>
                        <em>\uC800\uC7A5\uB41C \uBC30\uC1A1\uC9C0\uB97C \uD655\uC778\uD569\uB2C8\uB2E4.</em>
                      </div>
                      ${createShippingAddressList(member)}
                    </section>
                    <section class="profile-field-card profile-extra-address">
                      <div class="profile-field-title">
                        <span>\uCD94\uAC00 \uBC30\uC1A1\uC9C0</span>
                        <em>\uC790\uD0DD, \uB9E4\uC7A5, \uD68C\uC0AC \uB4F1 \uC790\uC8FC \uC4F0\uB294 \uC8FC\uC18C\uB97C \uB4F1\uB85D\uD569\uB2C8\uB2E4.</em>
                      </div>
                      <div class="profile-form-grid nested">
                        <label>\uBC30\uC1A1\uC9C0\uBA85<input class="quantity-input" name="extraAddressLabel" value="${escapeAttribute2(extraAddress.label)}" placeholder="\uC790\uD0DD / \uB9E4\uC7A5 / \uD68C\uC0AC" /></label>
                        <label>\uC218\uB839\uC778<input class="quantity-input" name="extraAddressRecipient" value="${escapeAttribute2(extraAddress.recipient)}" /></label>
                        <label>\uC5F0\uB77D\uCC98<input class="quantity-input" name="extraAddressPhone" value="${escapeAttribute2(extraAddress.phone)}" /></label>
                        <label>\uC6B0\uD3B8\uBC88\uD638
                          <span class="address-input-pair">
                            <input class="quantity-input" name="extraAddressPostcode" value="${escapeAttribute2(extraAddress.postcode)}" />
                            <button class="cart-button address-search" type="button" data-address-search data-address-prefix="extraAddress">\uC870\uD68C</button>
                          </span>
                        </label>
                        <label class="profile-wide">\uBC30\uC1A1\uC9C0<input class="quantity-input" name="extraAddressAddress" value="${escapeAttribute2(extraAddress.address)}" /></label>
                        <label class="profile-wide">\uC0C1\uC138\uC8FC\uC18C<input class="quantity-input" name="extraAddressDetail" value="${escapeAttribute2(extraAddress.addressDetail)}" /></label>
                        <div class="profile-wide">${createAddressLookupPanel("extraAddress")}</div>
                      </div>
                    </section>
                  </div>

                  <section class="profile-field-card profile-preference-card">
                    <div class="profile-field-title">
                      <span>\uC1FC\uD551 \uC124\uC815</span>
                      <em>\uACB0\uC81C\uC640 \uD61C\uD0DD \uC548\uB0B4\uC5D0 \uC0AC\uC6A9\uD560 \uAE30\uBCF8 \uC124\uC815\uC785\uB2C8\uB2E4.</em>
                    </div>
                    <div class="profile-form-grid profile-preference-grid">
                      <label>\uAE30\uBCF8 \uACB0\uC81C\uC218\uB2E8
                        <select class="option-select" name="paymentMethod">
                          ${createOption2("\uC2E0\uC6A9\uCE74\uB4DC", member.paymentMethod)}
                          ${createOption2("\uCE74\uCE74\uC624\uD398\uC774", member.paymentMethod)}
                          ${createOption2("\uB124\uC774\uBC84\uD398\uC774", member.paymentMethod)}
                          ${createOption2("\uBB34\uD1B5\uC7A5\uC785\uAE08", member.paymentMethod)}
                        </select>
                      </label>
                      <label>\uAD00\uC2EC \uCE74\uD14C\uACE0\uB9AC
                        <select class="option-select" name="favoriteCategory">
                          ${createOption2("\uBBF8\uC6A9\uAE30\uAD6C", member.favoriteCategory)}
                          ${createOption2("\uBBF8\uC6A9\uC7AC\uB8CC", member.favoriteCategory)}
                          ${createOption2("\uD654\uC7A5\uD488", member.favoriteCategory)}
                        </select>
                      </label>
                      <label class="auth-check profile-wide"><input type="checkbox" name="marketingOptIn" ${member.marketingOptIn === false ? "" : "checked"} /> \uC1FC\uD551 \uD61C\uD0DD \uBC0F \uBC30\uC1A1 \uC54C\uB9BC \uC218\uC2E0</label>
                    </div>
                  </section>
                </div>
                <div class="buy-actions profile-actions">
                  <button class="buy-button" type="submit">\uBCC0\uACBD\uC0AC\uD56D \uC800\uC7A5</button>
                </div>
              </form>
            </section>
            <section class="profile-tab-panel is-hidden" data-profile-panel="orders">
              ${createProfileOrderDashboard(sortOrderHistory(orders), stats)}
              ${createExpandableProfileSection("orders", "\uAD6C\uB9E4 \uB0B4\uC5ED", sortOrderHistory(orders), createProfileOrderRow, "\uAD6C\uB9E4\uC774\uB825\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.")}
              <section class="profile-order-detail is-hidden" id="profileOrderDetail" aria-live="polite"></section>
            </section>
            <section class="profile-tab-panel is-hidden" data-profile-panel="points">
              ${createProfilePointDashboard(points, stats)}
              ${createExpandableProfileSection("points", "\uD3EC\uC778\uD2B8 \uC801\uB9BD/\uC0AC\uC6A9 \uC774\uB825", sortPointHistory(points), createProfilePointRow, "\uD3EC\uC778\uD2B8 \uC774\uB825\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.")}
            </section>
            <section class="profile-tab-panel is-hidden" data-profile-panel="links">
              ${createProfileReferralDashboard(links)}
              ${createExpandableProfileSection("links", "\uCD94\uCC9C \uB9C1\uD06C", links, createProfileLinkRow, "\uCD94\uCC9C \uB9C1\uD06C\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4.")}
            </section>
            <section class="profile-tab-panel is-hidden" data-profile-panel="security">
              <div class="profile-section-head">
                <div>
                  <div class="product-category">Security</div>
                  <h3>\uBE44\uBC00\uBC88\uD638 \uBCC0\uACBD</h3>
                </div>
                <p>\uAE30\uC874 \uBE44\uBC00\uBC88\uD638 \uAC80\uC99D \uD6C4 \uC0C8 \uBE44\uBC00\uBC88\uD638\uB97C \uC800\uC7A5\uD569\uB2C8\uB2E4.</p>
              </div>
              <form class="profile-form password-form" data-password-form>
                <div class="profile-form-grid password-grid">
                  <label>\uAE30\uC874 \uBE44\uBC00\uBC88\uD638<input class="quantity-input" name="currentPassword" type="password" /></label>
                  <label>\uC0C8 \uBE44\uBC00\uBC88\uD638<input class="quantity-input" name="newPassword" type="password" placeholder="\uC601\uBB38+\uC22B\uC790 8\uC790 \uC774\uC0C1" /></label>
                  <label>\uC0C8 \uBE44\uBC00\uBC88\uD638 \uD655\uC778<input class="quantity-input" name="confirmPassword" type="password" /></label>
                  <button class="buy-button" type="submit">\uBE44\uBC00\uBC88\uD638 \uBCC0\uACBD</button>
                </div>
                <p class="auth-error" data-password-error aria-live="polite"></p>
              </form>
            </section>
          </div>
        </div>
      </section>
    </section>
  `;
    }
    function createProfileStats({ member, orders, points, links }) {
      const monthPrefix = /* @__PURE__ */ new Date().toISOString().slice(0, 7);
      const monthOrders = orders.filter((order) =>
        String(order.paidAt || "").startsWith(monthPrefix),
      );
      const earnedPoints = points
        .filter((point) => Number(point.amount) > 0)
        .reduce((sum, point) => sum + Number(point.amount || 0), 0);
      const usedPoints = points
        .filter((point) => Number(point.amount) < 0)
        .reduce((sum, point) => sum + Math.abs(Number(point.amount || 0)), 0);
      const monthEarned = points
        .filter(
          (point) =>
            Number(point.amount) > 0 &&
            String(point.createdAt || "").startsWith(monthPrefix),
        )
        .reduce((sum, point) => sum + Number(point.amount || 0), 0);
      const monthUsed = points
        .filter(
          (point) =>
            Number(point.amount) < 0 &&
            String(point.createdAt || "").startsWith(monthPrefix),
        )
        .reduce((sum, point) => sum + Math.abs(Number(point.amount || 0)), 0);
      const latestOrder = sortOrderHistory(orders)[0];
      return {
        activeLinks: links.filter((link) => link.status === "active").length,
        earnedPoints,
        latestOrder,
        monthEarned,
        monthOrderCount: monthOrders.length,
        monthPaid: monthOrders.reduce(
          (sum, order) => sum + Number(order.paidAmount || 0),
          0,
        ),
        monthUsed,
        totalPaid: orders.reduce(
          (sum, order) => sum + Number(order.paidAmount || 0),
          0,
        ),
        usedPoints,
      };
    }
    function createProfileTabButton(tab, label, isActive) {
      return `
    <button class="${isActive ? "is-active" : ""}" type="button" data-profile-tab="${tab}">
      ${label}
    </button>
  `;
    }
    function createMemberInitial(member) {
      return String(member.name || member.userId || "M")
        .trim()
        .slice(0, 1);
    }
    function createProfileOrderDashboard(orders, stats) {
      var _a, _b;
      return `
    <div class="profile-section-head">
      <div>
        <div class="product-category">Orders</div>
        <h3>\uAD6C\uB9E4 \uB0B4\uC5ED</h3>
      </div>
      <p>\uCD5C\uADFC \uC8FC\uBB38 \uC0C1\uD0DC\uC640 \uACB0\uC81C \uAE08\uC561\uC744 \uD655\uC778\uD558\uACE0, \uC8FC\uBB38\uBCC4 \uC0C1\uC138 \uB0B4\uC5ED\uC744 \uC5F4\uC5B4\uBCFC \uC218 \uC788\uC2B5\uB2C8\uB2E4.</p>
    </div>
    <div class="profile-insight-grid">
      <article><span>\uCD5C\uADFC \uC8FC\uBB38</span><strong>${((_a = stats.latestOrder) == null ? void 0 : _a.id) || "-"}</strong><em>${((_b = stats.latestOrder) == null ? void 0 : _b.paidAt) || "\uC8FC\uBB38 \uC5C6\uC74C"}</em></article>
      <article><span>\uB204\uC801 \uACB0\uC81C</span><strong>${formatMoney(stats.totalPaid)}</strong><em>\uBC30\uC1A1\uBE44 \uD3EC\uD568 \uACB0\uC81C\uAE08\uC561</em></article>
      <article><span>\uC774\uBC88\uB2EC \uC8FC\uBB38</span><strong>${stats.monthOrderCount}\uAC74</strong><em>${formatMoney(stats.monthPaid)}</em></article>
    </div>
    <div class="profile-order-status-strip">
      ${createOrderStatusCount(orders, "preparing", "\uC0C1\uD488\uC900\uBE44")}
      ${createOrderStatusCount(orders, "shipping", "\uBC30\uC1A1\uC911")}
      ${createOrderStatusCount(orders, "delivered", "\uBC30\uC1A1\uC644\uB8CC")}
      ${createOrderStatusCount(orders, "returned", "\uCDE8\uC18C/\uBC18\uD488")}
    </div>
  `;
    }
    function createOrderStatusCount(orders, status, label) {
      const count = orders.filter(
        (order) => (order.shippingStatus || "preparing") === status,
      ).length;
      return `<div><span>${label}</span><strong>${count}</strong></div>`;
    }
    function createProfilePointDashboard(points, stats) {
      var _a;
      return `
    <div class="profile-section-head">
      <div>
        <div class="product-category">Points</div>
        <h3>\uD3EC\uC778\uD2B8 \uAD00\uB9AC</h3>
      </div>
      <p>\uAD6C\uB9E4 \uC801\uB9BD, \uACB0\uC81C \uC0AC\uC6A9, \uC6D4\uBCC4 \uB204\uC801\uC744 \uBD84\uB9AC\uD574 \uD655\uC778\uD569\uB2C8\uB2E4. \uD3EC\uC778\uD2B8 \uC801\uB9BD/\uC0AC\uC6A9 \uC774\uB825\uC740 \uCD5C\uADFC 10\uAC1C\uBD80\uD130 \uD45C\uC2DC\uB429\uB2C8\uB2E4.</p>
    </div>
    <div class="profile-point-ledger-summary">
      <article><span>\uCD1D \uC801\uB9BD</span><strong>${stats.earnedPoints.toLocaleString("ko-KR")}P</strong><em>\uC774\uBC88\uB2EC ${stats.monthEarned.toLocaleString("ko-KR")}P</em></article>
      <article><span>\uCD1D \uC0AC\uC6A9</span><strong>${stats.usedPoints.toLocaleString("ko-KR")}P</strong><em>\uC774\uBC88\uB2EC ${stats.monthUsed.toLocaleString("ko-KR")}P</em></article>
      <article><span>\uCD5C\uADFC \uBCC0\uB3D9</span><strong>${points[0] ? `${Number(points[0].amount).toLocaleString("ko-KR")}P` : "0P"}</strong><em>${((_a = points[0]) == null ? void 0 : _a.createdAt) || "\uC774\uB825 \uC5C6\uC74C"}</em></article>
    </div>
  `;
    }
    function createProfileReferralDashboard(links) {
      var _a, _b;
      const activeLinks = links.filter((link) => link.status === "active");
      const productCount = new Set(links.map((link) => link.productId)).size;
      return `
    <div class="profile-section-head">
      <div>
        <div class="product-category">Referral</div>
        <h3>\uCD94\uCC9C \uB9C1\uD06C</h3>
      </div>
      <p>\uAD6C\uB9E4\uD55C \uC0C1\uD488\uBCC4\uB85C \uBC1C\uAE09\uB41C \uAC1C\uC778 \uCD94\uCC9C \uB9C1\uD06C\uB97C \uBCF5\uC0AC\uD574 \uACF5\uC720\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.</p>
    </div>
    <div class="profile-insight-grid">
      <article><span>\uD65C\uC131 \uB9C1\uD06C</span><strong>${activeLinks.length}\uAC1C</strong><em>\uBCF5\uC0AC \uAC00\uB2A5</em></article>
      <article><span>\uC0C1\uD488 \uC218</span><strong>${productCount}\uAC1C</strong><em>\uC0C1\uD488\uBCC4 1\uAC1C \uB9C1\uD06C</em></article>
      <article><span>\uCD5C\uADFC \uB9C1\uD06C</span><strong>${((_a = links[0]) == null ? void 0 : _a.code) || "-"}</strong><em>${((_b = links[0]) == null ? void 0 : _b.productId) || "\uB9C1\uD06C \uC5C6\uC74C"}</em></article>
    </div>
  `;
    }
    function createOption2(value, selectedValue) {
      return `<option value="${value}" ${value === selectedValue ? "selected" : ""}>${value}</option>`;
    }
    function createShippingAddressList(member) {
      const addresses = normalizeMemberShippingAddresses(member);
      if (!addresses.length) {
        return `<div class="admin-detail-empty compact">\uC800\uC7A5\uB41C \uBC30\uC1A1\uC9C0\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4.</div>`;
      }
      return `
    <div class="profile-address-list">
      ${addresses
        .map(
          (address) => `
          <article>
            <strong>${escapeHtml(address.label)}${address.isDefault ? " \xB7 \uAE30\uBCF8" : ""}</strong>
            <span>${escapeHtml(address.recipient || member.name || "")} / ${escapeHtml(address.phone || member.phone || "")}</span>
            <span>${escapeHtml(address.postcode)} ${escapeHtml(address.address)} ${escapeHtml(address.addressDetail)}</span>
          </article>
        `,
        )
        .join("")}
    </div>
  `;
    }
    function createProfileOrderRow(order) {
      var _a;
      const firstItem = (_a = order.items) == null ? void 0 : _a[0];
      const itemCount = (order.items || []).reduce(
        (sum, item) => sum + Number(item.qty || 0),
        0,
      );
      return `
    <article class="profile-row profile-order-row">
      <div>
        <strong>${order.id}</strong>
        <span>${order.paidAt} \xB7 ${createShippingStatusLabel(order.shippingStatus)}</span>
      </div>
      <div>
        <strong>${(firstItem == null ? void 0 : firstItem.productKo) || "\uC0C1\uD488"}</strong>
        <span>${itemCount}\uAC1C \xB7 \uC0C1\uD488\uAE08\uC561 ${formatMoney(order.paidProductAmount)}</span>
      </div>
      <div>
        <strong>${formatMoney(order.paidAmount || order.paidProductAmount)}</strong>
        <span>\uC0AC\uC6A9 ${Math.abs(order.pointUsed || 0).toLocaleString("ko-KR")}P \xB7 \uC801\uB9BD ${(order.pointEarned || 0).toLocaleString("ko-KR")}P</span>
      </div>
      <div class="profile-row-actions">
        <button class="buy-button mini-button" type="button" data-profile-order-detail="${order.id}">\uC8FC\uBB38 \uC0C1\uC138</button>
        <button class="cart-button mini-button" type="button" data-profile-tab="orders">\uBB38\uC758 \uC900\uBE44</button>
      </div>
    </article>
  `;
    }
    function createProfileOrderDetail(order) {
      const address = order.shippingAddress || {};
      return `
    <div class="profile-history-head">
      <div>
        <div class="product-category">Order detail</div>
        <h3>${order.id}</h3>
      </div>
      <button class="cart-button mini-button" type="button" data-profile-order-detail-close>\uB2EB\uAE30</button>
    </div>
    <div class="profile-order-summary-grid">
      <div><span>\uC8FC\uBB38\uC77C</span><strong>${order.paidAt}</strong></div>
      <div><span>\uBC30\uC1A1\uC0C1\uD0DC</span><strong>${createShippingStatusLabel(order.shippingStatus)}</strong></div>
      <div><span>\uD0DD\uBC30\uC0AC</span><strong>${order.courier || "\uCD9C\uACE0 \uC804"}</strong></div>
      <div><span>\uC1A1\uC7A5\uBC88\uD638</span><strong>${order.trackingNumber || "\uB4F1\uB85D \uB300\uAE30"}</strong></div>
      <div><span>\uBC30\uC1A1\uC9C0</span><strong>${formatProfileAddress(address)}</strong></div>
      <div><span>\uC0C1\uD488\uAE08\uC561</span><strong>${formatMoney(order.paidProductAmount)}</strong></div>
      <div><span>\uBC30\uC1A1\uBE44</span><strong>${order.shippingAmount ? formatMoney(order.shippingAmount) : "\uBB34\uB8CC"}</strong></div>
      <div><span>\uD3EC\uC778\uD2B8 \uC0AC\uC6A9</span><strong>${order.pointUsed ? `-${order.pointUsed.toLocaleString("ko-KR")}P` : "0P"}</strong></div>
      <div><span>\uC801\uB9BD \uD3EC\uC778\uD2B8</span><strong>${(order.pointEarned || 0).toLocaleString("ko-KR")}P</strong></div>
      <div><span>\uACB0\uC81C\uAE08\uC561</span><strong>${formatMoney(order.paidAmount)}</strong></div>
    </div>
    <div class="profile-list">
      ${(order.items || [])
        .map(
          (item) => `
          <article class="profile-row">
            <div><strong>${escapeHtml(item.productKo || item.productName)}</strong><span>${escapeHtml(item.option || "\uAE30\uBCF8 \uC635\uC158")}</span></div>
            <div><span>\uC218\uB7C9 ${item.qty}\uAC1C</span><strong>${formatMoney((item.sale || 0) * (item.qty || 1))}</strong></div>
          </article>
        `,
        )
        .join("")}
    </div>
  `;
    }
    function createShippingStatusLabel(status) {
      const labels = {
        preparing: "\uC0C1\uD488\uC900\uBE44",
        paid: "\uACB0\uC81C\uC644\uB8CC",
        shipping: "\uBC30\uC1A1\uC911",
        delivered: "\uBC30\uC1A1\uC644\uB8CC",
        returned: "\uCDE8\uC18C/\uBC18\uD488",
      };
      return labels[status] || createOrderStatusLabel(status);
    }
    function formatProfileAddress(address = {}) {
      const recipient = [address.recipient, address.phone]
        .filter(Boolean)
        .join(" / ");
      const location = [
        address.postcode,
        address.address,
        address.addressDetail,
      ]
        .filter(Boolean)
        .join(" ");
      return [recipient, location].filter(Boolean).join(" \xB7 ") || "-";
    }
    function createProfilePointRow(point) {
      const typeLabel = point.amount >= 0 ? "\uC801\uB9BD" : "\uC0AC\uC6A9";
      const sign = point.amount >= 0 ? "+" : "-";
      return `
    <article class="profile-row profile-point-row ${point.amount >= 0 ? "is-earned" : "is-used"}">
      <div><strong>${typeLabel}</strong><span>${point.createdAt || "-"}</span></div>
      <div><strong>${sign}${Math.abs(point.amount).toLocaleString("ko-KR")}P</strong><span>${point.note}</span></div>
      <div><span>\uAE30\uC900 \uAE08\uC561</span><strong>${formatMoney(point.baseAmount)}</strong></div>
      <div><span>\uC8FC\uBB38\uBC88\uD638</span><strong>${point.orderId || "-"}</strong></div>
    </article>
  `;
    }
    function createProfileLinkRow(link) {
      const url = createReferralUrl(link.code);
      return `
    <article class="profile-row referral-row">
      <div><strong>${link.code}</strong><span>${createReferralStatusLabel(link.status)} \xB7 ${link.productId}</span></div>
      <div>
        <span>${url}</span>
        <button class="cart-button mini-button" type="button" data-copy-referral="${url}">\uB9C1\uD06C \uBCF5\uC0AC</button>
      </div>
    </article>
  `;
    }
    function createExpandableProfileSection(
      type,
      title,
      items,
      createRow,
      emptyMessage,
    ) {
      const visible = items.slice(0, 10);
      const hidden = items.slice(10);
      return `
    <section class="profile-history-section ${type === "points" ? "" : "is-hidden"}" data-profile-history="${type}">
      <div class="profile-history-head">
        <div class="product-category">${title}</div>
        <span>\uCD5C\uADFC ${Math.min(10, items.length)}\uAC1C / \uCD1D ${items.length}\uAC1C</span>
      </div>
      <div class="profile-list">
        ${visible.map(createRow).join("") || `<div class="admin-detail-empty">${emptyMessage}</div>`}
        ${hidden.map((item) => `<div class="profile-more-item is-hidden" data-profile-more="${type}">${createRow(item)}</div>`).join("")}
      </div>
      ${hidden.length ? `<button class="cart-button profile-more-button" type="button" data-profile-more-button="${type}">\uB354\uBCF4\uAE30 ${hidden.length}\uAC1C</button>` : ""}
    </section>
  `;
    }
    function sortOrderHistory(orders) {
      return [...orders].sort((a, b) =>
        String(b.paidAt).localeCompare(a.paidAt),
      );
    }
    function sortPointHistory(points) {
      return [...points].sort((a, b) =>
        String(b.createdAt).localeCompare(a.createdAt),
      );
    }
    function createOrderStatusLabel(status) {
      const labels = {
        paid: "\uACB0\uC81C\uC644\uB8CC",
        shipping: "\uBC30\uC1A1\uC911",
        completed: "\uAD6C\uB9E4\uD655\uC815",
        cancelled: "\uCDE8\uC18C/\uD658\uBD88",
      };
      return labels[status] || status || "\uC0C1\uD0DC \uC5C6\uC74C";
    }
    function createReferralStatusLabel(status) {
      const labels = {
        active: "\uD65C\uC131",
        used: "\uC0AC\uC6A9\uB428",
        paused: "\uC911\uC9C0",
      };
      return labels[status] || status || "\uC0C1\uD0DC \uC5C6\uC74C";
    }
    function bindProfileEvents() {
      var _a, _b, _c, _d;
      (_a = document.querySelector("#profileClose")) == null
        ? void 0
        : _a.addEventListener("click", closeAuth);
      dom.auth.addEventListener("click", (event) => {
        if (event.target === dom.auth) closeAuth();
      });
      (_b = document.querySelector("[data-profile-close]")) == null
        ? void 0
        : _b.addEventListener("click", closeAuth);
      (_c = document.querySelector("[data-profile-form]")) == null
        ? void 0
        : _c.addEventListener("submit", (event) => {
            event.preventDefault();
            saveProfile(event.currentTarget);
            persistStore(store);
            updateSessionUi();
            showToast(
              "\uB0B4\uC815\uBCF4\uAC00 \uC800\uC7A5\uB418\uC5C8\uC2B5\uB2C8\uB2E4.",
            );
            openProfile();
          });
      (_d = document.querySelector("[data-password-form]")) == null
        ? void 0
        : _d.addEventListener("submit", (event) => {
            event.preventDefault();
            changePassword(event.currentTarget);
          });
      bindAddressLookupEvents();
      document.querySelectorAll("[data-profile-tab]").forEach((button) => {
        button.addEventListener("click", () =>
          activateProfileTab(button.dataset.profileTab),
        );
      });
      document.querySelectorAll("[data-profile-section]").forEach((button) => {
        button.addEventListener("click", () =>
          activateProfileTab(button.dataset.profileSection),
        );
      });
      document
        .querySelectorAll("[data-profile-more-button]")
        .forEach((button) => {
          button.addEventListener("click", () => {
            document
              .querySelectorAll(
                `[data-profile-more="${button.dataset.profileMoreButton}"]`,
              )
              .forEach((item) => item.classList.remove("is-hidden"));
            button.remove();
          });
        });
      document.querySelectorAll("[data-copy-referral]").forEach((button) => {
        button.addEventListener("click", async () => {
          await copyText(button.dataset.copyReferral);
          showToast(
            "\uCD94\uCC9C \uB9C1\uD06C\uAC00 \uBCF5\uC0AC\uB418\uC5C8\uC2B5\uB2C8\uB2E4.",
          );
        });
      });
      document
        .querySelectorAll("[data-profile-order-detail]")
        .forEach((button) => {
          button.addEventListener("click", () => {
            var _a2;
            const order = store.orders.find(
              (item) => item.id === button.dataset.profileOrderDetail,
            );
            const detail = document.querySelector("#profileOrderDetail");
            if (!order || !detail) return;
            detail.innerHTML = createProfileOrderDetail(order);
            detail.classList.remove("is-hidden");
            (_a2 = detail.querySelector("[data-profile-order-detail-close]")) ==
            null
              ? void 0
              : _a2.addEventListener("click", () =>
                  detail.classList.add("is-hidden"),
                );
          });
        });
    }
    function activateProfileTab(tab) {
      document.querySelectorAll("[data-profile-panel]").forEach((panel) => {
        panel.classList.toggle("is-hidden", panel.dataset.profilePanel !== tab);
      });
      document.querySelectorAll("[data-profile-tab]").forEach((button) => {
        button.classList.toggle("is-active", button.dataset.profileTab === tab);
      });
      document.querySelectorAll("[data-profile-history]").forEach((section) => {
        section.classList.toggle(
          "is-hidden",
          section.dataset.profileHistory !== tab,
        );
      });
    }
    function saveProfile(form) {
      var _a;
      const member = getCurrentMember2();
      if (!member) return;
      member.name = getFormValue(form, "name") || member.name;
      member.phone = getFormValue(form, "phone");
      member.email = getFormValue(form, "email");
      member.paymentMethod = getFormValue(form, "paymentMethod");
      member.favoriteCategory = getFormValue(form, "favoriteCategory");
      member.marketingOptIn = Boolean(
        (_a = form.querySelector('[name="marketingOptIn"]')) == null
          ? void 0
          : _a.checked,
      );
      member.address = {
        postcode: getFormValue(form, "postcode"),
        address: getFormValue(form, "address"),
        addressDetail: getFormValue(form, "addressDetail"),
      };
      member.shippingAddresses = buildProfileShippingAddresses(form, member);
    }
    function buildProfileShippingAddresses(form, member) {
      var _a, _b;
      const defaultAddress = {
        id: "addr-default",
        label: "\uAE30\uBCF8 \uBC30\uC1A1\uC9C0",
        recipient: member.name,
        phone: member.phone,
        postcode: member.address.postcode,
        address: member.address.address,
        addressDetail: member.address.addressDetail,
        isDefault: true,
      };
      const extraAddress = {
        id:
          ((_b =
            (_a = member.shippingAddresses) == null
              ? void 0
              : _a.find((address) => !address.isDefault)) == null
            ? void 0
            : _b.id) || `addr-${Date.now()}`,
        label:
          getFormValue(form, "extraAddressLabel") ||
          "\uCD94\uAC00 \uBC30\uC1A1\uC9C0",
        recipient: getFormValue(form, "extraAddressRecipient") || member.name,
        phone: getFormValue(form, "extraAddressPhone") || member.phone,
        postcode: getFormValue(form, "extraAddressPostcode"),
        address: getFormValue(form, "extraAddressAddress"),
        addressDetail: getFormValue(form, "extraAddressDetail"),
        isDefault: false,
      };
      return [defaultAddress, extraAddress].filter(
        (address) =>
          address.postcode || address.address || address.addressDetail,
      );
    }
    function changePassword(form) {
      const member = getCurrentMember2();
      if (!member) return;
      const currentPassword = getFormValue(form, "currentPassword");
      const newPassword = getFormValue(form, "newPassword");
      const confirmPassword = getFormValue(form, "confirmPassword");
      const error = form.querySelector("[data-password-error]");
      error.textContent = "";
      if (!member.passwordHash) {
        error.textContent =
          "\uAC04\uD3B8 \uB85C\uADF8\uC778 \uD68C\uC6D0\uC740 \uC77C\uBC18 \uBE44\uBC00\uBC88\uD638\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4.";
        return;
      }
      if (
        member.passwordHash !== hashPassword(member.userId, currentPassword)
      ) {
        error.textContent =
          "\uAE30\uC874 \uBE44\uBC00\uBC88\uD638\uAC00 \uC77C\uCE58\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.";
        return;
      }
      if (!isValidPassword(newPassword)) {
        error.textContent =
          "\uC0C8 \uBE44\uBC00\uBC88\uD638\uB294 \uC601\uBB38\uACFC \uC22B\uC790\uB97C \uD3EC\uD568\uD574 8\uC790 \uC774\uC0C1 \uC785\uB825\uD574\uC8FC\uC138\uC694.";
        return;
      }
      if (newPassword !== confirmPassword) {
        error.textContent =
          "\uC0C8 \uBE44\uBC00\uBC88\uD638 \uD655\uC778\uC774 \uC77C\uCE58\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.";
        return;
      }
      member.passwordHash = hashPassword(member.userId, newPassword);
      member.authProvider = "password";
      persistStore(store);
      showToast(
        "\uBE44\uBC00\uBC88\uD638\uAC00 \uBCC0\uACBD\uB418\uC5C8\uC2B5\uB2C8\uB2E4.",
      );
      form.reset();
    }
    function bindAuthEvents() {
      var _a, _b;
      (_a = document.querySelector("#authClose")) == null
        ? void 0
        : _a.addEventListener("click", closeAuth);
      dom.auth.addEventListener("click", (event) => {
        if (event.target === dom.auth) closeAuth();
      });
      document.querySelectorAll("[data-auth-mode]").forEach((button) => {
        button.addEventListener("click", () =>
          openAuth(button.dataset.authMode),
        );
      });
      document.querySelectorAll("[data-auth-complete]").forEach((button) => {
        button.addEventListener("click", () => {
          ensureQuickMember(button.dataset.authComplete);
          showToast(
            `${button.dataset.authComplete} \uD654\uBA74 \uC774\uB3D9\uC774 \uC644\uB8CC\uB418\uC5C8\uC2B5\uB2C8\uB2E4.`,
          );
          closeAuth();
        });
      });
      document.querySelectorAll("[data-auth-form]").forEach((form) => {
        form.addEventListener("submit", (event) => {
          event.preventDefault();
          let isValid = false;
          if (form.dataset.authForm === "signup") {
            isValid = registerMember(form);
            if (isValid)
              showToast(
                "\uD68C\uC6D0\uAC00\uC785\uC774 \uC644\uB8CC\uB418\uC5C8\uC2B5\uB2C8\uB2E4.",
              );
          } else {
            isValid = loginMember(form);
            if (isValid)
              showToast(
                "\uB85C\uADF8\uC778\uC774 \uC644\uB8CC\uB418\uC5C8\uC2B5\uB2C8\uB2E4.",
              );
          }
          if (!isValid) return;
          closeAuth();
        });
      });
      (_b = document.querySelector("#authGoShop")) == null
        ? void 0
        : _b.addEventListener("click", closeAuth);
      bindAddressLookupEvents();
    }
    function bindManagementLoginEvents(role, onSuccess) {
      var _a;
      (_a = document.querySelector("#authClose")) == null
        ? void 0
        : _a.addEventListener("click", closeAuth);
      dom.auth.addEventListener("click", (event) => {
        if (event.target === dom.auth) closeAuth();
      });
      document.querySelectorAll("[data-management-link]").forEach((link) => {
        link.addEventListener("click", (event) => {
          event.preventDefault();
          const targetRole = link.dataset.managementLink;
          openManagementLogin(targetRole, onSuccess);
        });
      });
      const form = document.querySelector("[data-management-login]");
      form == null
        ? void 0
        : form.addEventListener("submit", (event) => {
            event.preventDefault();
            const result =
              role === "admin"
                ? loginAdminManager(form)
                : loginAgencyManager(form);
            if (!result) return;
            showToast(
              `${role === "admin" ? "\uAD00\uB9AC\uC790" : "\uB300\uB9AC\uC810"} \uB85C\uADF8\uC778\uC774 \uC644\uB8CC\uB418\uC5C8\uC2B5\uB2C8\uB2E4.`,
            );
            closeAuth();
            onSuccess(role);
          });
    }
    function bindAddressLookupEvents() {
      document.querySelectorAll("[data-address-search]").forEach((button) => {
        button.addEventListener("click", () => {
          const container =
            button.closest("form") || button.closest(".address-box");
          const prefix = button.dataset.addressPrefix || "";
          const panel =
            container == null
              ? void 0
              : container.querySelector(`[data-address-panel="${prefix}"]`);
          panel == null ? void 0 : panel.classList.toggle("is-hidden");
        });
      });
      document.querySelectorAll("[data-address-result]").forEach((button) => {
        button.addEventListener("click", () => {
          var _a;
          fillAddressFields(button);
          (_a = button.closest("[data-address-panel]")) == null
            ? void 0
            : _a.classList.add("is-hidden");
        });
      });
    }
    function fillAddressFields(button) {
      const container =
        button.closest("form") || button.closest(".address-box");
      if (!container) return;
      const prefix = button.dataset.addressPrefix || "";
      const fieldNames = prefix
        ? {
            postcode: `${prefix}Postcode`,
            address: `${prefix}Address`,
            detail: `${prefix}Detail`,
          }
        : {
            postcode: "postcode",
            address: "address",
            detail: "addressDetail",
          };
      const postcode = container.querySelector(
        `[name="${fieldNames.postcode}"]`,
      );
      const address = container.querySelector(`[name="${fieldNames.address}"]`);
      const detail = container.querySelector(`[name="${fieldNames.detail}"]`);
      if (postcode) postcode.value = button.dataset.postcode || "";
      if (address) address.value = button.dataset.address || "";
      if (detail) detail.focus();
      showToast(
        "\uBC30\uC1A1\uC9C0\uB97C \uC120\uD0DD\uD588\uC2B5\uB2C8\uB2E4. \uC0C1\uC138\uC8FC\uC18C\uB97C \uC785\uB825\uD574\uC8FC\uC138\uC694.",
      );
    }
    function registerMember(form) {
      clearFormError(form);
      const userId = normalizeUserId(getFormValue(form, "userId"));
      const password = getFormValue(form, "password");
      if (!isValidUserId(userId)) {
        setFormError(
          form,
          "\uC544\uC774\uB514\uB294 \uC601\uBB38 \uBC0F \uC22B\uC790\uB85C 6\uC790 \uC774\uC0C1 \uC785\uB825\uD574\uC8FC\uC138\uC694.",
        );
        return false;
      }
      if (!isValidPassword(password)) {
        setFormError(
          form,
          "\uBE44\uBC00\uBC88\uD638\uB294 \uC601\uBB38\uACFC \uC22B\uC790\uB97C \uD3EC\uD568\uD574 8\uC790 \uC774\uC0C1 \uC785\uB825\uD574\uC8FC\uC138\uC694.",
        );
        return false;
      }
      if (findMemberByUserId(userId)) {
        setFormError(
          form,
          "\uC774\uBBF8 \uAC00\uC785\uB41C \uC544\uC774\uB514\uC785\uB2C8\uB2E4. \uB2E4\uB978 \uC544\uC774\uB514\uB97C \uC785\uB825\uD574\uC8FC\uC138\uC694.",
        );
        return false;
      }
      const agency =
        findAgencyByCode(getFormValue(form, "agencyCode")) ||
        getPendingAgency() ||
        getHeadquartersAgency2();
      const memberId = `member-${Date.now()}`;
      store.members.push({
        id: memberId,
        userId,
        passwordHash: hashPassword(userId, password),
        authProvider: "password",
        name:
          getFormValue(form, "name") || userId || "\uC2E0\uADDC\uD68C\uC6D0",
        phone: getFormValue(form, "phone"),
        email: getFormValue(form, "email"),
        agencyId: agency.id,
        role: "member",
        points: 0,
        status: "active",
        joinedAt: /* @__PURE__ */ new Date().toISOString().slice(0, 10),
        address: {
          postcode: getFormValue(form, "postcode"),
          address: getFormValue(form, "address"),
          addressDetail: getFormValue(form, "addressDetail"),
        },
        shippingAddresses: [
          {
            id: "addr-default",
            label: "\uAE30\uBCF8 \uBC30\uC1A1\uC9C0",
            recipient:
              getFormValue(form, "name") ||
              userId ||
              "\uC2E0\uADDC\uD68C\uC6D0",
            phone: getFormValue(form, "phone"),
            postcode: getFormValue(form, "postcode"),
            address: getFormValue(form, "address"),
            addressDetail: getFormValue(form, "addressDetail"),
            isDefault: true,
          },
        ].filter(
          (address) =>
            address.postcode || address.address || address.addressDetail,
        ),
      });
      store.currentMemberId = memberId;
      store.pendingAgencySlug = "";
      persistStore(store);
      updateSessionUi();
      return true;
    }
    function loginMember(form) {
      clearFormError(form);
      const userId = normalizeUserId(getFormValue(form, "userId"));
      const password = getFormValue(form, "password");
      const member = findMemberByUserId(userId);
      if (!userId || !password) {
        setFormError(
          form,
          "\uC544\uC774\uB514\uC640 \uBE44\uBC00\uBC88\uD638\uB97C \uBAA8\uB450 \uC785\uB825\uD574\uC8FC\uC138\uC694.",
        );
        return false;
      }
      if (
        !member ||
        member.status !== "active" ||
        !member.passwordHash ||
        member.passwordHash !== hashPassword(userId, password)
      ) {
        setFormError(
          form,
          "\uC544\uC774\uB514 \uB610\uB294 \uBE44\uBC00\uBC88\uD638\uAC00 \uC77C\uCE58\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.",
        );
        return false;
      }
      store.currentMemberId = member.id;
      persistStore(store);
      updateSessionUi();
      return true;
    }
    function loginAdminManager(form) {
      var _a;
      clearFormError(form);
      const userId = getFormValue(form, "userId");
      const password = getFormValue(form, "password");
      if (userId !== "adminChang" || password !== "Chang$0909") {
        setFormError(
          form,
          "\uAD00\uB9AC\uC790 \uC544\uC774\uB514 \uB610\uB294 \uBE44\uBC00\uBC88\uD638\uAC00 \uC77C\uCE58\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.",
        );
        return false;
      }
      const admin = ensureManagementMember({
        id: "member-admin",
        userId: "adminChang",
        name: "\uAD00\uB9AC\uC790",
        role: "admin",
        agencyId: (_a = getHeadquartersAgency2()) == null ? void 0 : _a.id,
        passwordHash: hashPassword(userId, password),
      });
      store.currentMemberId = admin.id;
      persistStore(store);
      updateSessionUi();
      return true;
    }
    function loginAgencyManager(form) {
      clearFormError(form);
      const userId = normalizeUserId(getFormValue(form, "userId"));
      const password = getFormValue(form, "password");
      const agency = store.agencies.find(
        (item) =>
          normalizeUserId(item.loginUserId) === userId &&
          item.status === "active",
      );
      if (
        !agency ||
        !agency.loginPasswordHash ||
        agency.loginPasswordHash !== hashPassword(userId, password)
      ) {
        setFormError(
          form,
          "\uB300\uB9AC\uC810 \uC544\uC774\uB514 \uB610\uB294 \uBE44\uBC00\uBC88\uD638\uAC00 \uC77C\uCE58\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.",
        );
        return false;
      }
      const member = ensureManagementMember({
        id: `member-agency-${agency.id}`,
        userId,
        name: agency.name,
        role: "agency_manager",
        agencyId: agency.id,
        passwordHash: agency.loginPasswordHash,
      });
      store.currentMemberId = member.id;
      persistStore(store);
      updateSessionUi();
      return true;
    }
    function ensureManagementMember({
      id,
      userId,
      name,
      role,
      agencyId,
      passwordHash,
    }) {
      let member =
        store.members.find((item) => item.id === id) ||
        store.members.find(
          (item) => normalizeUserId(item.userId) === normalizeUserId(userId),
        );
      if (!member) {
        member = {
          id,
          userId,
          passwordHash,
          authProvider: "password",
          name,
          phone: "",
          email: "",
          agencyId,
          role,
          points: 0,
          status: "active",
          joinedAt: /* @__PURE__ */ new Date().toISOString().slice(0, 10),
          address: {},
          shippingAddresses: [],
        };
        store.members.push(member);
      }
      Object.assign(member, {
        userId,
        passwordHash,
        authProvider: "password",
        name,
        agencyId,
        role,
        status: "active",
      });
      return member;
    }
    function getFormValue(form, name) {
      var _a;
      return String(
        ((_a = form.querySelector(`[name="${name}"]`)) == null
          ? void 0
          : _a.value) || "",
      ).trim();
    }
    function setFormError(form, message) {
      const error = form.querySelector("[data-auth-error]");
      if (error) error.textContent = message;
    }
    function clearFormError(form) {
      setFormError(form, "");
    }
    function normalizeUserId(userId) {
      return String(userId || "")
        .trim()
        .toLowerCase();
    }
    function isValidUserId(userId) {
      return /^[a-z0-9]{6,}$/i.test(userId);
    }
    function isValidPassword(password) {
      return /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(password);
    }
    function findMemberByUserId(userId) {
      const normalized = normalizeUserId(userId);
      return store.members.find(
        (member) => normalizeUserId(member.userId) === normalized,
      );
    }
    function hashPassword(userId, password) {
      const source = `${normalizeUserId(userId)}:${password}:beauty-ref-demo-v1`;
      let hash = 2166136261;
      for (let index = 0; index < source.length; index += 1) {
        hash ^= source.charCodeAt(index);
        hash = Math.imul(hash, 16777619);
      }
      return (hash >>> 0).toString(16).padStart(8, "0");
    }
    async function copyText(text) {
      var _a;
      if ((_a = navigator.clipboard) == null ? void 0 : _a.writeText) {
        await navigator.clipboard.writeText(text);
        return;
      }
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";
      document.body.append(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
    }
    function createReferralUrl(code) {
      return `${window.location.origin}${window.location.pathname}?ref=${encodeURIComponent(code)}`;
    }
    function migrateMemberAuthDefaults() {
      let changed = false;
      store.members.forEach((member) => {
        if (member.userId === "beauty_user") {
          member.userId = "beauty01";
          member.passwordHash = hashPassword(member.userId, "password123");
          member.authProvider = "password";
          changed = true;
        }
        if (!member.authProvider) {
          member.authProvider = member.passwordHash ? "password" : "social";
          changed = true;
        }
      });
      if (changed) persistStore(store);
    }
    function escapeAttribute2(value) {
      return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    }
    function ensureQuickMember(label) {
      const existing = getCurrentMember2();
      if (existing) return;
      const agency = getPendingAgency() || getHeadquartersAgency2();
      const memberId = `member-${Date.now()}`;
      store.members.push({
        id: memberId,
        userId: `quick_${store.members.length + 1}`,
        name: label,
        phone: "",
        email: "",
        agencyId: agency.id,
        role: "member",
        points: 0,
        status: "active",
        authProvider: "social",
        joinedAt: /* @__PURE__ */ new Date().toISOString().slice(0, 10),
        address: {},
        shippingAddresses: [],
      });
      store.currentMemberId = memberId;
      persistStore(store);
      updateSessionUi();
    }
    function getCurrentMember2() {
      return store.members.find(
        (member) => member.id === store.currentMemberId,
      );
    }
    function findAgencyByCode(code) {
      const normalized = String(code || "")
        .trim()
        .toUpperCase();
      if (!normalized) return null;
      return store.agencies.find(
        (agency) => agency.code.toUpperCase() === normalized,
      );
    }
    function getPendingAgency() {
      const slug = store.pendingAgencySlug;
      if (!slug) return null;
      return store.agencies.find(
        (agency) => agency.linkSlug === slug || agency.code === slug,
      );
    }
    function getHeadquartersAgency2() {
      return store.agencies.find((agency) => agency.isHeadquarters);
    }
    function normalizeMemberShippingAddresses(member) {
      var _a, _b, _c;
      const addresses = Array.isArray(member.shippingAddresses)
        ? member.shippingAddresses
        : [];
      if (addresses.length) return addresses;
      if (
        ((_a = member.address) == null ? void 0 : _a.postcode) ||
        ((_b = member.address) == null ? void 0 : _b.address) ||
        ((_c = member.address) == null ? void 0 : _c.addressDetail)
      ) {
        return [
          {
            id: "addr-default",
            label: "\uAE30\uBCF8 \uBC30\uC1A1\uC9C0",
            recipient: member.name,
            phone: member.phone,
            postcode: member.address.postcode || "",
            address: member.address.address || "",
            addressDetail: member.address.addressDetail || "",
            isDefault: true,
          },
        ];
      }
      return [];
    }
    function createMemberStatusLabel(status) {
      const labels = {
        active: "\uC815\uC0C1",
        paused: "\uC911\uC9C0",
        dormant: "\uD734\uBA74",
        blocked: "\uCC28\uB2E8",
      };
      return labels[status] || status || "\uC815\uC0C1";
    }
    function showAuthView() {
      dom.auth.classList.remove("is-hidden");
      document.body.classList.add("modal-open");
    }
    function escapeHtml(value) {
      return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
    }
    return {
      openAuth,
      openProfile,
      openManagementLogin,
      closeAuth,
      showAuthView,
    };
  }

  // scripts/ui/management.js
  var PRODUCT_OPERATION_DEFAULTS = {
    taxType: "taxable",
    status: "selling",
    displayStatus: "displayed",
    shippingType: "default",
    shippingFee: "3000",
    safetyStock: "5",
    manufacturer: "BEAUTY REF.",
    supplier: "\uBCF8\uC0AC \uBB3C\uB958",
    origin: "Korea",
    brand: "BEAUTY REF.",
  };
  function createManagementController({
    dom,
    store,
    closeCart,
    persistStore = () => {},
  }) {
    function openManagement(role = "admin") {
      closeCart();
      dom.management.innerHTML = createManagementView(role, store);
      bindManagementEvents(role);
      dom.home.classList.add("is-hidden");
      dom.detail.classList.add("is-hidden");
      dom.auth.classList.add("is-hidden");
      dom.management.classList.remove("is-hidden");
      scrollTo({ top: 0, behavior: "smooth" });
    }
    function bindManagementEvents(role) {
      if (role === "admin") {
        bindAdminSettingsForm();
        bindMetricModal(
          "[data-admin-detail]",
          "#adminDetailModal",
          "admin",
          (type) => createAdminDetailContent(type, store),
        );
      }
      if (role === "agency") {
        bindMetricModal(
          "[data-agency-detail]",
          "#agencyDetailModal",
          "agency",
          (type) => createAgencyDetailContent(type, store),
        );
      }
    }
    function bindAdminSettingsForm() {
      const form = dom.management.querySelector("[data-admin-settings-form]");
      if (!form) return;
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        store.settings.purchasePointRate = readPercentField(
          form,
          "purchasePointRate",
        );
        store.settings.maxPointUseRate = readPercentField(
          form,
          "maxPointUseRate",
        );
        store.settings.personalReferrerRewardRate = readPercentField(
          form,
          "personalReferrerRewardRate",
        );
        store.settings.personalBuyerBonusRate = readPercentField(
          form,
          "personalBuyerBonusRate",
        );
        store.settings.friendSignupPoint = Math.max(
          0,
          Number(form.querySelector('[name="friendSignupPoint"]').value || 0),
        );
        persistStore(store);
        dom.management.innerHTML = createAdminDashboard(store);
        bindManagementEvents("admin");
      });
    }
    function readPercentField(form, name) {
      const value = Number(form.querySelector(`[name="${name}"]`).value || 0);
      return Math.min(100, Math.max(0, value));
    }
    function bindMetricModal(
      cardSelector,
      modalSelector,
      scope,
      createContent,
    ) {
      const modal = dom.management.querySelector(modalSelector);
      if (!modal) return;
      dom.management.querySelectorAll(cardSelector).forEach((card) => {
        const open = () => {
          const detailType =
            card.dataset.adminDetail || card.dataset.agencyDetail;
          modal.dataset.currentDetail = detailType;
          openDetailModal(modal, createContent(detailType));
          if (
            modalSelector === "#adminDetailModal" &&
            detailType === "agencies"
          ) {
            bindAgencyAdminForm(modal);
          }
          if (
            modalSelector === "#adminDetailModal" &&
            detailType === "products"
          ) {
            bindProductAdminForm(modal);
          }
        };
        card.addEventListener("click", open);
        card.addEventListener("keydown", (event) => {
          if (event.key !== "Enter" && event.key !== " ") return;
          event.preventDefault();
          open();
        });
      });
      modal.addEventListener("click", (event) => {
        const copyButton = event.target.closest("[data-copy-agency-link]");
        if (copyButton) {
          copyText(copyButton.dataset.copyAgencyLink);
          copyButton.textContent = "\uBCF5\uC0AC \uC644\uB8CC";
          return;
        }
        const settlementButton = event.target.closest(
          "[data-settlement-status]",
        );
        if (settlementButton) {
          updateSettlementStatus(
            settlementButton.dataset.settlementStatus,
            settlementButton.dataset.statusValue,
          );
          persistStore(store);
          openDetailModal(
            modal,
            createContent(modal.dataset.currentDetail || "settlements"),
          );
          return;
        }
        const agencyMonthButton = event.target.closest("[data-agency-month]");
        if (agencyMonthButton) {
          const monthType = `month:${agencyMonthButton.dataset.agencyMonth}`;
          modal.dataset.monthBackDetail =
            modal.dataset.currentDetail || "sales";
          modal.dataset.currentDetail = monthType;
          openDetailModal(modal, createContent(monthType));
          return;
        }
        const agencyMonthBack = event.target.closest(
          "[data-agency-month-back]",
        );
        if (agencyMonthBack) {
          const backType = modal.dataset.monthBackDetail || "sales";
          modal.dataset.currentDetail = backType;
          openDetailModal(modal, createContent(backType));
          return;
        }
        const agencyAdminDetail = event.target.closest(
          "[data-agency-admin-detail]",
        );
        if (agencyAdminDetail) {
          modal.dataset.currentDetail = `agency:${agencyAdminDetail.dataset.agencyAdminDetail}`;
          openDetailModal(
            modal,
            createAgencyAdminProfileDetail(
              agencyAdminDetail.dataset.agencyAdminDetail,
              store,
            ),
          );
          return;
        }
        const agencyListBack = event.target.closest("[data-agency-list-back]");
        if (agencyListBack) {
          modal.dataset.currentDetail = "agencies";
          openDetailModal(modal, createContent("agencies"));
          bindAgencyAdminForm(modal);
          return;
        }
        const memberButton = event.target.closest("[data-member-detail]");
        if (memberButton) {
          openDetailModal(
            modal,
            createMemberProfileDetail(
              memberButton.dataset.memberDetail,
              store,
              scope,
              modal.dataset.currentDetail || "members",
            ),
          );
          return;
        }
        const memoForm = event.target.closest("[data-member-memo-form]");
        if (memoForm && event.type === "click") return;
        const backButton = event.target.closest("[data-member-detail-back]");
        if (backButton) {
          const detailType = backButton.dataset.memberDetailBack || "members";
          modal.dataset.currentDetail = detailType;
          openDetailModal(modal, createContent(detailType));
          return;
        }
        if (
          event.target.matches("[data-modal-close]") ||
          event.target === modal
        ) {
          closeDetailModal(modal);
        }
      });
      modal.addEventListener("submit", (event) => {
        const shipmentForm = event.target.closest("[data-shipment-form]");
        if (shipmentForm) {
          event.preventDefault();
          updateShipmentInfo(shipmentForm);
          persistStore(store);
          openDetailModal(modal, createContent("orders"));
          return;
        }
        const memoForm = event.target.closest("[data-member-memo-form]");
        if (!memoForm) return;
        event.preventDefault();
        const member = store.members.find(
          (item) => item.id === memoForm.dataset.memberMemoForm,
        );
        if (!member) return;
        member.internalMemo = memoForm.querySelector(
          '[name="internalMemo"]',
        ).value;
        persistStore(store);
        openDetailModal(
          modal,
          createMemberProfileDetail(
            member.id,
            store,
            scope,
            modal.dataset.currentDetail || "members",
          ),
        );
      });
    }
    function copyText(value) {
      var _a, _b;
      const text = String(value || "");
      if ((_a = navigator.clipboard) == null ? void 0 : _a.writeText) {
        navigator.clipboard.writeText(text).catch(() => {});
        return;
      }
      const input = document.createElement("input");
      input.value = text;
      document.body.append(input);
      input.select();
      (_b = document.execCommand) == null ? void 0 : _b.call(document, "copy");
      input.remove();
    }
    function updateSettlementStatus(settlementId, status) {
      const settlement = store.agencySettlementLedger.find(
        (item) => item.id === settlementId,
      );
      if (!settlement) return;
      const changedAt = /* @__PURE__ */ new Date().toISOString().slice(0, 10);
      const actor = getCurrentMember(store);
      settlement.status = status;
      settlement.updatedAt = changedAt;
      settlement.statusUpdatedBy =
        (actor == null ? void 0 : actor.userId) ||
        (actor == null ? void 0 : actor.name) ||
        "admin";
      settlement.statusNote = getSettlementStatusLabel(status);
      settlement.statusHistory = [
        ...(settlement.statusHistory || []),
        {
          status,
          changedAt,
          changedBy: settlement.statusUpdatedBy,
          note: settlement.statusNote,
        },
      ];
    }
    function updateShipmentInfo(form) {
      const order = store.orders.find(
        (item) => item.id === form.dataset.shipmentForm,
      );
      if (!order) return;
      order.shippingStatus = form.querySelector(
        '[name="shippingStatus"]',
      ).value;
      order.courier = form.querySelector('[name="courier"]').value.trim();
      order.trackingNumber = form
        .querySelector('[name="trackingNumber"]')
        .value.trim();
      order.shippedAt = form.querySelector('[name="shippedAt"]').value;
      order.deliveredAt = form.querySelector('[name="deliveredAt"]').value;
      order.shippingMemo = form.querySelector('[name="shippingMemo"]').value;
      if (order.shippingStatus === "shipping" && !order.shippedAt) {
        order.shippedAt = /* @__PURE__ */ new Date().toISOString().slice(0, 10);
      }
      if (order.shippingStatus === "delivered" && !order.deliveredAt) {
        order.deliveredAt = /* @__PURE__ */ new Date()
          .toISOString()
          .slice(0, 10);
      }
    }
    function bindAgencyAdminForm(modal) {
      var _a;
      const formBox = modal.querySelector("[data-agency-form]");
      if (!formBox) return;
      (_a = modal.querySelector("[data-agency-create]")) == null
        ? void 0
        : _a.addEventListener("click", () => {
            resetAgencyForm(formBox);
            showAgencyForm(formBox);
          });
      formBox
        .querySelector("[data-agency-submit]")
        .addEventListener("click", () => {
          saveAgencyFromForm(formBox);
          persistStore(store);
          reopenAdminDetail("agencies");
        });
      formBox.querySelector('[name="name"]').addEventListener("input", () => {
        const generated = createAgencyIdentifiers(
          getAgencyField(formBox, "name").value,
        );
        const codeInput = getAgencyField(formBox, "code");
        const linkInput = getAgencyField(formBox, "linkSlug");
        if (!codeInput.dataset.manual || !codeInput.value.trim()) {
          codeInput.value = generated.code;
        }
        if (!linkInput.dataset.manual || !linkInput.value.trim()) {
          linkInput.value = generated.linkSlug;
        }
      });
      ["code", "linkSlug"].forEach((name) => {
        getAgencyField(formBox, name).addEventListener("input", (event) => {
          event.target.dataset.manual = "true";
        });
      });
      modal.querySelectorAll("[data-agency-edit]").forEach((button) => {
        button.addEventListener("click", () => {
          const agency = store.agencies.find(
            (item) => item.id === button.dataset.agencyEdit,
          );
          if (!agency) return;
          getAgencyField(formBox, "agencyId").value = agency.id;
          getAgencyField(formBox, "name").value = agency.name;
          getAgencyField(formBox, "code").value = agency.code;
          getAgencyField(formBox, "linkSlug").value = agency.linkSlug;
          getAgencyField(formBox, "commissionRate").value =
            agency.commissionRate;
          getAgencyField(formBox, "status").value = agency.status;
          getAgencyField(formBox, "contractStart").value =
            agency.contractStart || "";
          getAgencyField(formBox, "contractEnd").value =
            agency.contractEnd || "";
          getAgencyField(formBox, "managerName").value =
            agency.managerName || "";
          getAgencyField(formBox, "managerPhone").value =
            agency.managerPhone || "";
          getAgencyField(formBox, "settlementAccount").value =
            agency.settlementAccount || "";
          getAgencyField(formBox, "loginUserId").value =
            agency.loginUserId || "";
          getAgencyField(formBox, "loginPassword").value = "";
          getAgencyField(formBox, "code").dataset.manual = "true";
          getAgencyField(formBox, "linkSlug").dataset.manual = "true";
          formBox.querySelector("[data-agency-submit]").textContent =
            "\uB300\uB9AC\uC810 \uC218\uC815";
          showAgencyForm(formBox);
        });
      });
      modal.querySelectorAll("[data-agency-delete]").forEach((button) => {
        button.addEventListener("click", () => {
          deleteAgency(button.dataset.agencyDelete);
          persistStore(store);
          reopenAdminDetail("agencies");
        });
      });
      formBox
        .querySelector("[data-agency-reset]")
        .addEventListener("click", () => resetAgencyForm(formBox));
    }
    function showAgencyForm(formBox) {
      var _a, _b;
      formBox.classList.remove("is-hidden");
      (_a = formBox.scrollIntoView) == null
        ? void 0
        : _a.call(formBox, { behavior: "smooth", block: "start" });
      (_b = getAgencyField(formBox, "name")) == null ? void 0 : _b.focus();
    }
    function resetAgencyForm(formBox) {
      formBox.querySelectorAll("input, textarea").forEach((input) => {
        input.value = input.name === "commissionRate" ? "10" : "";
        delete input.dataset.manual;
      });
      getAgencyField(formBox, "status").value = "active";
      formBox.querySelector("[data-agency-submit]").textContent =
        "\uB300\uB9AC\uC810 \uB4F1\uB85D";
    }
    function bindProductAdminForm(modal) {
      const formBox = modal.querySelector("[data-product-form]");
      if (!formBox) return;
      formBox
        .querySelector("[data-product-submit]")
        .addEventListener("click", () => {
          if (!saveProductFromForm(formBox)) return;
          persistStore(store);
          reopenAdminDetail("products");
        });
      modal.querySelectorAll("[data-product-edit]").forEach((button) => {
        button.addEventListener("click", () => {
          const product = store.products.find(
            (item) => item.id === button.dataset.productEdit,
          );
          if (!product) return;
          fillProductForm(formBox, product);
        });
      });
      modal.querySelectorAll("[data-product-visibility]").forEach((button) => {
        button.addEventListener("click", () => {
          const product = store.products.find(
            (item) => item.id === button.dataset.productVisibility,
          );
          if (!product) return;
          product.displayStatus =
            product.displayStatus === "hidden" ? "displayed" : "hidden";
          if (product.status === "deleted") product.status = "stopped";
          persistStore(store);
          reopenAdminDetail("products");
        });
      });
      modal
        .querySelectorAll("[data-product-category-filter]")
        .forEach((button) => {
          button.addEventListener("click", () => {
            modal
              .querySelectorAll("[data-product-category-filter]")
              .forEach((item) => {
                item.classList.toggle("is-active", item === button);
              });
            applyProductListControls(modal);
          });
        });
      modal
        .querySelectorAll(
          "[data-product-list-search], [data-product-status-filter], [data-product-sort]",
        )
        .forEach((control) => {
          control.addEventListener("input", () =>
            applyProductListControls(modal),
          );
          control.addEventListener("change", () =>
            applyProductListControls(modal),
          );
        });
      formBox
        .querySelector("[data-product-reset]")
        .addEventListener("click", () => resetProductForm(formBox));
      formBox
        .querySelector("[data-product-defaults]")
        .addEventListener("click", () => {
          applyProductDefaults(formBox);
          setProductFormMessage(
            formBox,
            "\uC6B4\uC601 \uAE30\uBCF8\uAC12\uC744 \uC801\uC6A9\uD588\uC2B5\uB2C8\uB2E4.",
            "info",
          );
        });
      getProductField(formBox, "image").addEventListener("input", () =>
        updateProductImagePreview(formBox),
      );
      formBox
        .querySelector("[data-product-image-clear]")
        .addEventListener("click", () => {
          getProductField(formBox, "image").value = "";
          updateProductImagePreview(formBox);
        });
      formBox
        .querySelector("[data-product-image-sample]")
        .addEventListener("click", () => {
          getProductField(formBox, "image").value =
            "https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=1200&q=80";
          updateProductImagePreview(formBox);
        });
      formBox
        .querySelector("[data-product-image-file]")
        .addEventListener("change", (event) => {
          var _a;
          const file = (_a = event.target.files) == null ? void 0 : _a[0];
          if (!file) return;
          const reader = new FileReader();
          reader.addEventListener("load", () => {
            getProductField(formBox, "image").value = reader.result;
            updateProductImagePreview(formBox);
          });
          reader.readAsDataURL(file);
        });
      formBox
        .querySelectorAll("[data-product-detail-image-file]")
        .forEach((input) => {
          input.addEventListener("change", (event) => {
            var _a;
            const file = (_a = event.target.files) == null ? void 0 : _a[0];
            const index = Number(input.dataset.productDetailImageFile);
            if (!file || !index) return;
            const reader = new FileReader();
            reader.addEventListener("load", () => {
              getProductField(formBox, `detailImage${index}`).value =
                reader.result;
              updateProductDetailImagePreviews(formBox);
            });
            reader.readAsDataURL(file);
          });
        });
      formBox
        .querySelectorAll("[data-product-detail-image-clear]")
        .forEach((button) => {
          button.addEventListener("click", () => {
            const index = Number(button.dataset.productDetailImageClear);
            getProductField(formBox, `detailImage${index}`).value = "";
            updateProductDetailImagePreviews(formBox);
          });
        });
      formBox
        .querySelectorAll("[data-product-detail-image-input]")
        .forEach((input) => {
          input.addEventListener("input", () =>
            updateProductDetailImagePreviews(formBox),
          );
        });
      formBox
        .querySelector("[data-variant-add]")
        .addEventListener("click", () => {
          addVariantEditorRow(formBox, {
            optionName: getProductField(formBox, "option").value.trim(),
            sku: createProductSku(getProductField(formBox, "name").value),
            stock: readNumberField(formBox, "stock"),
            priceDelta: 0,
            status: "selling",
          });
          syncVariantEditorToTextarea(formBox);
        });
      formBox
        .querySelector("[data-variant-editor]")
        .addEventListener("input", () => syncVariantEditorToTextarea(formBox));
      formBox
        .querySelector("[data-variant-editor]")
        .addEventListener("change", () => syncVariantEditorToTextarea(formBox));
      formBox
        .querySelector("[data-variant-editor]")
        .addEventListener("click", (event) => {
          var _a;
          const removeButton = event.target.closest("[data-variant-remove]");
          if (!removeButton) return;
          const rows = formBox.querySelectorAll("[data-variant-row]");
          if (rows.length <= 1) {
            resetVariantEditor(formBox);
            return;
          }
          (_a = removeButton.closest("[data-variant-row]")) == null
            ? void 0
            : _a.remove();
          syncVariantEditorToTextarea(formBox);
        });
      updateProductImagePreview(formBox);
      updateProductDetailImagePreviews(formBox);
      resetVariantEditor(formBox);
    }
    function getProductField(formBox, name) {
      return formBox.querySelector(`[name="${name}"]`);
    }
    function applyProductListControls(modal) {
      var _a, _b, _c, _d;
      const activeCategory =
        ((_a = modal.querySelector(
          "[data-product-category-filter].is-active",
        )) == null
          ? void 0
          : _a.dataset.productCategoryFilter) || "all";
      const search = (
        ((_b = modal.querySelector("[data-product-list-search]")) == null
          ? void 0
          : _b.value) || ""
      )
        .trim()
        .toLowerCase();
      const status =
        ((_c = modal.querySelector("[data-product-status-filter]")) == null
          ? void 0
          : _c.value) || "all";
      const sort =
        ((_d = modal.querySelector("[data-product-sort]")) == null
          ? void 0
          : _d.value) || "default";
      const list = modal.querySelector("[data-product-card-list]");
      const cards = Array.from(
        modal.querySelectorAll("[data-product-category-card]"),
      );
      cards.forEach((card) => {
        var _a2;
        const stock = Number(card.dataset.productStock || 0);
        const safetyStock = Number(card.dataset.productSafetyStock || 0);
        const matchesCategory =
          activeCategory === "all" ||
          card.dataset.productCategoryCard === activeCategory;
        const matchesSearch =
          !search ||
          ((_a2 = card.dataset.productSearch) == null
            ? void 0
            : _a2.includes(search));
        const matchesStatus =
          status === "all" ||
          (status === "hidden"
            ? card.dataset.productDisplay === "hidden"
            : status === "low-stock"
              ? stock <= safetyStock
              : card.dataset.productStatus === status);
        card.classList.toggle(
          "is-filtered-out",
          !matchesCategory || !matchesSearch || !matchesStatus,
        );
      });
      sortProductCards(list, cards, sort);
    }
    function sortProductCards(list, cards, sort) {
      if (!list) return;
      const sorted = [...cards].sort((a, b) => {
        if (sort === "name") {
          return (a.dataset.productName || "").localeCompare(
            b.dataset.productName || "",
            "ko-KR",
          );
        }
        if (sort === "sale-desc") {
          return (
            Number(b.dataset.productSale || 0) -
            Number(a.dataset.productSale || 0)
          );
        }
        if (sort === "sale-asc") {
          return (
            Number(a.dataset.productSale || 0) -
            Number(b.dataset.productSale || 0)
          );
        }
        if (sort === "stock-asc") {
          return (
            Number(a.dataset.productStock || 0) -
            Number(b.dataset.productStock || 0)
          );
        }
        if (sort === "hidden-first") {
          return (
            Number(b.dataset.productDisplay === "hidden") -
            Number(a.dataset.productDisplay === "hidden")
          );
        }
        return 0;
      });
      sorted.forEach((card) => list.append(card));
    }
    function saveProductFromForm(formBox) {
      const productId = getProductField(formBox, "productId").value;
      const payload = readProductForm(formBox);
      if (!payload.ko || !payload.sale) {
        setProductFormMessage(
          formBox,
          "\uC0C1\uD488\uBA85 \uD55C\uAE00\uACFC \uD310\uB9E4\uAC00\uB294 \uD544\uC218\uC785\uB2C8\uB2E4.",
        );
        return false;
      }
      if (payload.status === "selling" && payload.stock <= 0) {
        setProductFormMessage(
          formBox,
          "\uD310\uB9E4\uC911 \uC0C1\uD488\uC740 \uC7AC\uACE0\uB97C 1\uAC1C \uC774\uC0C1 \uC785\uB825\uD574\uC57C \uAD6C\uB9E4 \uAC00\uB2A5\uD569\uB2C8\uB2E4.",
        );
        return false;
      }
      const skuError = getSkuValidationError(payload, productId);
      if (skuError) {
        setProductFormMessage(formBox, skuError);
        return false;
      }
      if (productId) {
        const product = store.products.find((item) => item.id === productId);
        if (!product) {
          setProductFormMessage(
            formBox,
            "\uC218\uC815\uD560 \uC0C1\uD488\uC744 \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.",
          );
          return false;
        }
        Object.assign(product, payload);
        return true;
      }
      store.products.push({
        id: createProductId(payload),
        ...payload,
      });
      return true;
    }
    function readProductForm(formBox) {
      syncVariantEditorToTextarea(formBox);
      const price = readNumberField(formBox, "price");
      const sale = readNumberField(formBox, "sale");
      const stock = readNumberField(formBox, "stock");
      const option = getProductField(formBox, "option").value.trim();
      const sku =
        normalizeSku(getProductField(formBox, "sku").value) ||
        createProductSku(getProductField(formBox, "name").value);
      return {
        sku,
        name:
          getProductField(formBox, "name").value.trim() ||
          createProductSku(getProductField(formBox, "ko").value),
        ko: getProductField(formBox, "ko").value.trim(),
        category: getProductField(formBox, "category").value,
        type: getProductField(formBox, "type").value.trim(),
        badge: getProductField(formBox, "badge").value.trim(),
        price,
        sale,
        supplyPrice: readNumberField(formBox, "supplyPrice"),
        cost: readNumberField(formBox, "cost"),
        taxType: getProductField(formBox, "taxType").value,
        status: getProductField(formBox, "status").value,
        displayStatus: getProductField(formBox, "displayStatus").value,
        stock,
        safetyStock: readNumberField(formBox, "safetyStock"),
        shippingType: getProductField(formBox, "shippingType").value,
        shippingFee: readNumberField(formBox, "shippingFee"),
        pointRateOverride: getProductField(formBox, "pointRateOverride").value,
        option,
        image: getProductField(formBox, "image").value.trim(),
        detailImages: readProductDetailImages(formBox),
        short: getProductField(formBox, "short").value.trim(),
        desc: getProductField(formBox, "desc").value.trim(),
        searchKeywords: getProductField(formBox, "searchKeywords").value.trim(),
        manufacturer: readTextWithDefault(formBox, "manufacturer"),
        supplier: readTextWithDefault(formBox, "supplier"),
        origin: readTextWithDefault(formBox, "origin"),
        brand: readTextWithDefault(formBox, "brand"),
        barcode: getProductField(formBox, "barcode").value.trim(),
        variants: parseVariantRows(
          getProductField(formBox, "variants").value,
          sku,
          option,
          stock,
        ),
      };
    }
    function fillProductForm(formBox, product) {
      const fields = [
        "sku",
        "name",
        "ko",
        "category",
        "type",
        "badge",
        "price",
        "sale",
        "supplyPrice",
        "cost",
        "taxType",
        "status",
        "displayStatus",
        "stock",
        "safetyStock",
        "shippingType",
        "shippingFee",
        "pointRateOverride",
        "option",
        "image",
        "short",
        "desc",
        "searchKeywords",
        "manufacturer",
        "supplier",
        "origin",
        "brand",
        "barcode",
      ];
      getProductField(formBox, "productId").value = product.id;
      fields.forEach((field) => {
        var _a;
        getProductField(formBox, field).value =
          (_a = product[field]) != null ? _a : "";
      });
      fillProductDetailImages(formBox, product.detailImages);
      getProductField(formBox, "variants").value = formatVariantRows(product);
      fillVariantEditor(formBox, product.variants);
      updateProductImagePreview(formBox);
      updateProductDetailImagePreviews(formBox);
      formBox.querySelector("[data-product-submit]").textContent =
        "\uC0C1\uD488 \uC218\uC815";
      setProductFormMessage(formBox, "");
    }
    function resetProductForm(formBox) {
      formBox.querySelectorAll("input, textarea").forEach((input) => {
        input.value = "";
      });
      getProductField(formBox, "category").value = "\uD654\uC7A5\uD488";
      getProductField(formBox, "taxType").value = "taxable";
      getProductField(formBox, "status").value = "selling";
      getProductField(formBox, "displayStatus").value = "displayed";
      getProductField(formBox, "shippingType").value = "default";
      applyProductDefaults(formBox);
      resetVariantEditor(formBox);
      updateProductImagePreview(formBox);
      updateProductDetailImagePreviews(formBox);
      formBox.querySelector("[data-product-submit]").textContent =
        "\uC0C1\uD488 \uB4F1\uB85D";
      setProductFormMessage(formBox, "");
    }
    function applyProductDefaults(formBox) {
      Object.entries(PRODUCT_OPERATION_DEFAULTS).forEach(([field, value]) => {
        const input = getProductField(formBox, field);
        if (input) input.value = value;
      });
    }
    function readTextWithDefault(formBox, field) {
      return (
        getProductField(formBox, field).value.trim() ||
        PRODUCT_OPERATION_DEFAULTS[field] ||
        ""
      );
    }
    function setProductFormMessage(formBox, message, tone = "error") {
      const messageBox = formBox.querySelector("[data-product-form-message]");
      if (!messageBox) return;
      messageBox.textContent = message;
      messageBox.dataset.tone = tone;
    }
    function getSkuValidationError(payload, productId) {
      const productSku = normalizeSku(payload.sku);
      const variantSkus = payload.variants
        .map((variant) => normalizeSku(variant.sku))
        .filter(Boolean);
      const submittedSkus = [productSku, ...variantSkus].filter(Boolean);
      const duplicateInForm = findDuplicateValue(submittedSkus);
      if (duplicateInForm) {
        return `SKU\uAC00 \uC911\uBCF5\uB418\uC5C8\uC2B5\uB2C8\uB2E4: ${duplicateInForm}`;
      }
      const existingSkus = [];
      (store.products || []).forEach((product) => {
        if (product.id === productId || product.status === "deleted") return;
        existingSkus.push(normalizeSku(product.sku));
        (product.variants || []).forEach((variant) => {
          existingSkus.push(normalizeSku(variant.sku));
        });
      });
      const existingSkuSet = new Set(existingSkus.filter(Boolean));
      const duplicatedExisting = submittedSkus.find((sku) =>
        existingSkuSet.has(sku),
      );
      return duplicatedExisting
        ? `\uC774\uBBF8 \uC0AC\uC6A9 \uC911\uC778 SKU\uC785\uB2C8\uB2E4: ${duplicatedExisting}`
        : "";
    }
    function findDuplicateValue(values) {
      const seen = /* @__PURE__ */ new Set();
      return values.find((value) => {
        if (seen.has(value)) return true;
        seen.add(value);
        return false;
      });
    }
    function normalizeSku(value) {
      return String(value || "")
        .trim()
        .toUpperCase();
    }
    function updateProductImagePreview(formBox) {
      const preview = formBox.querySelector("[data-product-image-preview]");
      const image = getProductField(formBox, "image").value.trim();
      preview.innerHTML = image
        ? `<img src="${escapeAttribute(image)}" alt="\uC0C1\uD488 \uC774\uBBF8\uC9C0 \uBBF8\uB9AC\uBCF4\uAE30" />`
        : "<span>\uC774\uBBF8\uC9C0 \uC5C6\uC74C</span>";
    }
    function readProductDetailImages(formBox) {
      return Array.from({ length: 5 }, (_, index) =>
        getProductField(formBox, `detailImage${index + 1}`).value.trim(),
      ).filter(Boolean);
    }
    function fillProductDetailImages(formBox, images = []) {
      Array.from({ length: 5 }, (_, index) => {
        getProductField(formBox, `detailImage${index + 1}`).value =
          images[index] || "";
      });
    }
    function updateProductDetailImagePreviews(formBox) {
      formBox
        .querySelectorAll("[data-product-detail-image-preview]")
        .forEach((preview) => {
          const index = Number(preview.dataset.productDetailImagePreview);
          const image = getProductField(
            formBox,
            `detailImage${index}`,
          ).value.trim();
          preview.innerHTML = image
            ? `<img src="${escapeAttribute(image)}" alt="\uC0C1\uC138 \uC774\uBBF8\uC9C0 ${index} \uBBF8\uB9AC\uBCF4\uAE30" />`
            : `<span>${index}</span>`;
        });
    }
    function addVariantEditorRow(formBox, variant = {}) {
      const editor = formBox.querySelector("[data-variant-editor]");
      const row = document.createElement("article");
      row.className = "variant-editor-row";
      row.dataset.variantRow = "true";
      row.innerHTML = createVariantEditorRow(variant);
      editor.append(row);
    }
    function fillVariantEditor(formBox, variants = []) {
      const editor = formBox.querySelector("[data-variant-editor]");
      editor.innerHTML = "";
      const rows = variants.length ? variants : parseVariantRows("", "", "", 0);
      rows.forEach((variant) => addVariantEditorRow(formBox, variant));
      syncVariantEditorToTextarea(formBox);
    }
    function resetVariantEditor(formBox) {
      fillVariantEditor(formBox, [
        {
          optionName:
            getProductField(formBox, "option").value.trim() ||
            "\uAE30\uBCF8 \uC635\uC158",
          sku: "",
          stock: readNumberField(formBox, "stock"),
          priceDelta: 0,
          status: "selling",
        },
      ]);
    }
    function syncVariantEditorToTextarea(formBox) {
      const rows = Array.from(formBox.querySelectorAll("[data-variant-row]"));
      getProductField(formBox, "variants").value = rows
        .map((row, index) => {
          var _a, _b, _c, _d, _e;
          const optionName =
            ((_a = row.querySelector("[data-variant-option]")) == null
              ? void 0
              : _a.value.trim()) || `\uC635\uC158 ${index + 1}`;
          const sku =
            ((_b = row.querySelector("[data-variant-sku]")) == null
              ? void 0
              : _b.value.trim()) || "";
          const stock = Math.max(
            0,
            Number(
              ((_c = row.querySelector("[data-variant-stock]")) == null
                ? void 0
                : _c.value) || 0,
            ),
          );
          const priceDelta = Number(
            ((_d = row.querySelector("[data-variant-price-delta]")) == null
              ? void 0
              : _d.value) || 0,
          );
          const status =
            ((_e = row.querySelector("[data-variant-status]")) == null
              ? void 0
              : _e.value) || "selling";
          return `${optionName} | ${sku} | ${stock} | ${priceDelta} | ${status}`;
        })
        .join("\n");
    }
    function readNumberField(formBox, name) {
      return Math.max(0, Number(getProductField(formBox, name).value || 0));
    }
    function parseVariantRows(value, baseSku, fallbackOption, fallbackStock) {
      const rows = String(value || "")
        .split(/\n+/)
        .map((row) => row.trim())
        .filter(Boolean);
      const parsed = rows.map((row, index) => {
        const [optionName, sku, stock, priceDelta, status] = row
          .split("|")
          .map((part) => part.trim());
        return {
          id: `${baseSku.toLowerCase()}-${index + 1}`,
          optionName:
            optionName || fallbackOption || "\uAE30\uBCF8 \uC635\uC158",
          sku: sku || `${baseSku}-OPT${index + 1}`,
          stock: Math.max(0, Number(stock || 0)),
          priceDelta: Number(priceDelta || 0),
          status: status || "selling",
        };
      });
      return parsed.length
        ? parsed
        : [
            {
              id: `${baseSku.toLowerCase()}-default`,
              optionName: fallbackOption || "\uAE30\uBCF8 \uC635\uC158",
              sku: `${baseSku}-STD`,
              stock: fallbackStock,
              priceDelta: 0,
              status: "selling",
            },
          ];
    }
    function formatVariantRows(product) {
      return (product.variants || [])
        .map(
          (variant) =>
            `${variant.optionName || ""} | ${variant.sku || ""} | ${variant.stock || 0} | ${variant.priceDelta || 0} | ${variant.status || "selling"}`,
        )
        .join("\n");
    }
    function createProductId(product) {
      const base = createProductSku(product.name || product.ko)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      let id = `product-${base || Date.now()}`;
      let suffix = 1;
      while (store.products.some((productItem) => productItem.id === id)) {
        suffix += 1;
        id = `product-${base}-${suffix}`;
      }
      return id;
    }
    function createProductSku(value) {
      const source = String(value || "PRODUCT")
        .trim()
        .toUpperCase()
        .replace(/[^A-Z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      return source || `PRODUCT-${Date.now()}`;
    }
    function getAgencyField(formBox, name) {
      return formBox.querySelector(`[name="${name}"]`);
    }
    function saveAgencyFromForm(formBox) {
      const agencyId = getAgencyField(formBox, "agencyId").value;
      const payload = {
        name: getAgencyField(formBox, "name").value.trim(),
        code: getAgencyField(formBox, "code").value.trim().toUpperCase(),
        linkSlug: getAgencyField(formBox, "linkSlug").value.trim(),
        commissionRate: Math.max(
          0,
          Number(getAgencyField(formBox, "commissionRate").value || 0),
        ),
        status: getAgencyField(formBox, "status").value || "active",
        contractStart: getAgencyField(formBox, "contractStart").value.trim(),
        contractEnd: getAgencyField(formBox, "contractEnd").value.trim(),
        managerName: getAgencyField(formBox, "managerName").value.trim(),
        managerPhone: getAgencyField(formBox, "managerPhone").value.trim(),
        settlementAccount: getAgencyField(
          formBox,
          "settlementAccount",
        ).value.trim(),
        loginUserId: getAgencyField(formBox, "loginUserId").value.trim(),
        loginPassword: getAgencyField(formBox, "loginPassword").value.trim(),
      };
      if (!payload.name || !payload.code || !payload.linkSlug) return;
      if (agencyId) {
        const agency = store.agencies.find((item) => item.id === agencyId);
        if (!agency || agency.isHeadquarters) return;
        Object.assign(agency, createAgencySavePayload(payload, agency));
        return;
      }
      store.agencies.push({
        id: `agency-${payload.linkSlug.replace(/[^a-z0-9-]/gi, "-").toLowerCase()}-${store.agencies.length + 1}`,
        ...createAgencySavePayload(payload),
        isHeadquarters: false,
      });
    }
    function createAgencySavePayload(payload, existingAgency = {}) {
      const { loginPassword, ...agencyPayload } = payload;
      agencyPayload.loginPasswordHash = loginPassword
        ? hashManagementPassword(agencyPayload.loginUserId, loginPassword)
        : existingAgency.loginPasswordHash || "";
      return agencyPayload;
    }
    function deleteAgency(agencyId) {
      const agency = store.agencies.find((item) => item.id === agencyId);
      const headquarters = store.agencies.find((item) => item.isHeadquarters);
      if (!agency || agency.isHeadquarters || !headquarters) return;
      store.members.forEach((member) => {
        if (member.agencyId === agency.id) {
          member.agencyId = headquarters.id;
        }
      });
      store.agencies = store.agencies.filter((item) => item.id !== agency.id);
    }
    function reopenAdminDetail(type) {
      dom.management.innerHTML = createAdminDashboard(store);
      bindManagementEvents("admin");
      const modal = dom.management.querySelector("#adminDetailModal");
      openDetailModal(modal, createAdminDetailContent(type, store));
      if (type === "agencies") bindAgencyAdminForm(modal);
      if (type === "products") bindProductAdminForm(modal);
    }
    return { openManagement };
  }
  function createManagementView(role, store) {
    if (role === "agency") return createAgencyDashboard(store);
    if (role === "member") return createMemberDashboard(store);
    return createAdminDashboard(store);
  }
  function createAdminDashboard(store) {
    const headquarters = store.agencies.find((agency) => agency.isHeadquarters);
    const agencyCount = store.agencies.length;
    const memberCount = store.members.length;
    const sellingProductCount = (store.products || []).filter(
      (product) => product.status !== "deleted",
    ).length;
    const monthlyOrders = getCurrentMonthOrders(store);
    const monthlyOrderTotal = monthlyOrders.reduce(
      (sum, order) => sum + order.paidProductAmount,
      0,
    );
    const monthlyPointSummary = getCurrentMonthPointSummary(store);
    const settlementPending = store.agencySettlementLedger.reduce(
      (sum, item) => sum + item.commissionAmount,
      0,
    );
    return `
    <section class="management-dashboard">
      <div class="management-head">
        <div>
          <div class="product-category">Admin / Headquarters</div>
          <h1 class="detail-title">Admin Control.</h1>
        </div>
        <p>\uD3EC\uC778\uD2B8, \uB300\uB9AC\uC810, \uC0C1\uD488, \uCD94\uCC9C\uB9C1\uD06C, \uC815\uC0B0\uC744 \uB2E8\uACC4\uBCC4\uB85C \uAD00\uB9AC\uD558\uAE30 \uC704\uD55C \uAD00\uB9AC\uC790 \uD654\uBA74 \uACE8\uACA9\uC785\uB2C8\uB2E4.</p>
      </div>
      <div class="management-grid">
        ${createMetricCard("admin", "headquarters", "\uBCF8\uC0AC \uB300\uB9AC\uC810", headquarters.name)}
        ${createMetricCard("admin", "agencies", "\uB300\uB9AC\uC810 \uC218", `${agencyCount}`)}
        ${createMetricCard("admin", "members", "\uD68C\uC6D0 \uC218", `${memberCount}`)}
        ${createMetricCard("admin", "products", "\uC0C1\uD488 \uC218", `${sellingProductCount}`)}
        ${createMetricCard("admin", "orders", "\uC774\uB2EC\uC758 \uC8FC\uBB38", formatMoney(monthlyOrderTotal))}
        ${createMetricCard("admin", "points", "\uC774\uB2EC\uC758 \uC801\uB9BD\uAE08", `${monthlyPointSummary.earned.toLocaleString("ko-KR")}P`)}
        ${createMetricCard("admin", "settlements", "\uC815\uC0B0 \uB300\uAE30 \uC601\uC5C5\uBE44", formatMoney(settlementPending))}
      </div>
      ${createSettingsPanel(store)}
      ${createDetailModal("adminDetailModal", "adminModalContent")}
    </section>
  `;
  }
  function createMetricCard(scope, type, label, value) {
    const attribute =
      scope === "agency" ? "data-agency-detail" : "data-admin-detail";
    return `
    <article class="management-card-action" tabindex="0" role="button" ${attribute}="${type}" aria-label="${label} \uC0C1\uC138 \uBCF4\uAE30">
      <span>${label}</span>
      <strong>${value}</strong>
    </article>
  `;
  }
  function createAgencySettlementMetric(sales, commission) {
    return `
    <article class="management-card-action settlement-metric-card" tabindex="0" role="button" data-agency-detail="settlement" aria-label="\uC815\uC0B0\uB9E4\uCD9C\uACFC \uC601\uC5C5\uBE44 \uC0C1\uC138 \uBCF4\uAE30">
      <span>\uC815\uC0B0\uB9E4\uCD9C / \uC601\uC5C5\uBE44</span>
      <strong>${formatMoney(sales)}</strong>
      <em>\uC601\uC5C5\uBE44 ${formatMoney(commission)}</em>
    </article>
  `;
  }
  function createSettingsPanel(store) {
    const settings = store.settings;
    return `
    <section class="management-panel">
      <div class="product-category">Admin settings</div>
      <form class="admin-settings-form" data-admin-settings-form>
        <label>\uAD6C\uB9E4 \uC801\uB9BD\uB960<input class="quantity-input" name="purchasePointRate" type="number" min="0" max="100" value="${settings.purchasePointRate}" /></label>
        <label>\uD3EC\uC778\uD2B8 \uC0AC\uC6A9 \uD55C\uB3C4<input class="quantity-input" name="maxPointUseRate" type="number" min="0" max="100" value="${settings.maxPointUseRate}" /></label>
        <label>\uCE5C\uAD6C\uAC00\uC785 \uD3EC\uC778\uD2B8<input class="quantity-input" name="friendSignupPoint" type="number" min="0" step="100" value="${settings.friendSignupPoint}" /></label>
        <label>\uAC1C\uC778 \uCD94\uCC9C\uC790 \uC9C0\uAE09\uB960<input class="quantity-input" name="personalReferrerRewardRate" type="number" min="0" max="100" value="${settings.personalReferrerRewardRate}" /></label>
        <label>\uAD6C\uB9E4\uC790 \uCD94\uAC00 \uC9C0\uAE09\uB960<input class="quantity-input" name="personalBuyerBonusRate" type="number" min="0" max="100" value="${settings.personalBuyerBonusRate}" /></label>
        <button class="buy-button" type="submit">\uC124\uC815 \uC800\uC7A5</button>
      </form>
    </section>
  `;
  }
  function createDetailModal(modalId, contentId) {
    return `
    <div class="admin-modal" id="${modalId}" aria-hidden="true" hidden>
      <div class="admin-modal-card" role="dialog" aria-modal="true" aria-labelledby="adminModalTitle">
        <button class="cart-close admin-modal-close" type="button" data-modal-close aria-label="\uC0C1\uC138 \uD31D\uC5C5 \uB2EB\uAE30">\xD7</button>
        <div class="admin-modal-content" id="${contentId}">
          <div class="admin-detail-empty">
            \uB300\uC2DC\uBCF4\uB4DC \uD56D\uBAA9\uC744 \uC120\uD0DD\uD558\uBA74 \uAD00\uB828 \uC0C1\uC138 \uB9AC\uC2A4\uD2B8\uAC00 \uD45C\uC2DC\uB429\uB2C8\uB2E4.
          </div>
        </div>
      </div>
    </div>
  `;
  }
  function openDetailModal(modal, html) {
    const content = modal.querySelector(".admin-modal-content");
    if (!content) return;
    content.innerHTML = html;
    modal.hidden = false;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    modal.querySelector("[data-modal-close]").focus();
  }
  function closeDetailModal(modal) {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    modal.hidden = true;
    document.body.classList.remove("modal-open");
  }
  function createAdminDetailContent(type, store) {
    const detail = getAdminDetail(type, store);
    return `
    <div class="detail-panel-head">
      <div>
        <div class="product-category">Admin detail / ${detail.label}</div>
        <h2 id="adminModalTitle">${detail.title}</h2>
      </div>
      <p>${detail.description}</p>
    </div>
    <div class="process-list">
      ${detail.extra || ""}
      ${detail.rows.join("") || '<div class="admin-detail-empty">\uD45C\uC2DC\uD560 \uB370\uC774\uD130\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4.</div>'}
    </div>
  `;
  }
  function getAdminDetail(type, store) {
    const detailMap = {
      headquarters: {
        label: "Headquarters",
        title: "\uBCF8\uC0AC \uB300\uB9AC\uC810 \uC0C1\uC138",
        description:
          "\uB300\uB9AC\uC810 \uCF54\uB4DC \uC5C6\uC774 \uAC00\uC785\uD55C \uD68C\uC6D0\uC774 \uADC0\uC18D\uB418\uB294 \uBCF8\uC0AC \uB300\uB9AC\uC810 \uC815\uBCF4\uC785\uB2C8\uB2E4.",
        rows: store.agencies
          .filter((agency) => agency.isHeadquarters)
          .map(createAgencyDetailRow),
      },
      agencies: {
        label: "Agencies",
        title: "\uB300\uB9AC\uC810 \uB9AC\uC2A4\uD2B8",
        description:
          "\uB300\uB9AC\uC810\uBCC4 \uC774\uB2EC \uB9E4\uCD9C, \uC601\uC5C5\uBE44, \uD68C\uC6D0 \uC218\uB97C \uBA3C\uC800 \uD655\uC778\uD569\uB2C8\uB2E4. \uB300\uB9AC\uC810 \uCF54\uB4DC\uC640 \uC804\uC6A9 \uB9C1\uD06C\uB294 \uC0C1\uC138 \uD654\uBA74\uC5D0\uC11C\uB9CC \uD45C\uC2DC\uD569\uB2C8\uB2E4.",
        extra: createAgencyAdminWorkspace(store),
        rows: [],
      },
      members: {
        label: "Members",
        title: "\uD68C\uC6D0 \uC0C1\uC138 \uB9AC\uC2A4\uD2B8",
        description:
          "\uD68C\uC6D0\uBCC4 \uD3EC\uC778\uD2B8, \uC8FC\uBB38 \uC218, \uB0B4\uBD80 \uB300\uB9AC\uC810 \uADC0\uC18D \uC815\uBCF4\uB97C \uAD00\uB9AC\uC790\uC6A9\uC73C\uB85C \uD655\uC778\uD569\uB2C8\uB2E4.",
        rows: store.members.map((member) =>
          createMemberDetailRow(member, store),
        ),
      },
      products: {
        label: "Products",
        title: "\uC0C1\uD488\uAD00\uB9AC",
        description:
          "Cafe24\uD615 \uC0C1\uD488\uAD00\uB9AC \uAE30\uC900\uC73C\uB85C \uAE30\uBCF8\uC815\uBCF4, \uAC00\uACA9, \uC7AC\uACE0, \uD45C\uC2DC/\uD310\uB9E4\uC0C1\uD0DC, \uBC30\uC1A1, \uACF5\uAE09\uC0AC, \uC635\uC158 SKU\uB97C \uAD00\uB9AC\uD569\uB2C8\uB2E4.",
        extra: createProductManagementWorkspace(store),
        rows: [],
      },
      orders: {
        label: "Orders",
        title: "\uC774\uB2EC\uC758 \uC8FC\uBB38 / \uBC30\uC1A1 \uAD00\uB9AC",
        description:
          "\uB300\uB9AC\uC810\uBCC4 \uC774\uB2EC \uB204\uC801 \uAE08\uC561\uC744 \uD655\uC778\uD558\uACE0, \uC8FC\uBB38\uBCC4 \uBC30\uC1A1\uC0C1\uD0DC\uC640 \uC1A1\uC7A5 \uC815\uBCF4\uB97C \uAD00\uB9AC\uD569\uB2C8\uB2E4.",
        extra: createAdminOrderShippingWorkspace(store),
        rows: [],
      },
      points: {
        label: "Points",
        title: "\uC774\uB2EC\uC758 \uD3EC\uC778\uD2B8 \uC0C1\uC138",
        description:
          "\uC774\uBC88 \uB2EC \uD3EC\uC778\uD2B8 \uC7A5\uBD80\uC5D0\uC11C \uC801\uB9BD \uD3EC\uC778\uD2B8\uC640 \uC0AC\uC6A9 \uD3EC\uC778\uD2B8\uB97C \uBD84\uB9AC\uD574 \uB204\uC801 \uD45C\uC2DC\uD569\uB2C8\uB2E4.",
        extra: createMonthlyPointSummary(store),
        rows: getCurrentMonthPoints(store).map(createPointDetailRow),
      },
      settlements: {
        label: "Settlements",
        title:
          "\uB300\uB9AC\uC810 \uC815\uC0B0 \uB300\uAE30 \uC0C1\uC138 \uB9AC\uC2A4\uD2B8",
        description:
          "\uAC1C\uC778 \uCD94\uCC9C\uB9C1\uD06C \uAD6C\uB9E4\uB97C \uC81C\uC678\uD558\uACE0 \uB300\uB9AC\uC810 \uC601\uC5C5\uBE44 \uC9C0\uAE09 \uB300\uC0C1\uC73C\uB85C \uC7A1\uD78C \uC7A5\uBD80\uC785\uB2C8\uB2E4.",
        rows: store.agencySettlementLedger.map((item) =>
          createSettlementDetailRow(item, store, { allowStatusActions: true }),
        ),
      },
    };
    return detailMap[type] || detailMap.orders;
  }
  function createAgencyDetailRow(agency) {
    const link = createAgencyPublicLink(agency);
    return `
    <article class="process-row">
      <div><strong>${agency.name}</strong><span>${agency.isHeadquarters ? "\uBCF8\uC0AC \uB300\uB9AC\uC810" : "\uACC4\uC57D \uB300\uB9AC\uC810"}</span></div>
      <div><span>\uC804\uC6A9 \uCF54\uB4DC</span><strong>${agency.code}</strong></div>
      <div><span>\uC804\uC6A9 \uB9C1\uD06C</span><strong><a href="?agency=${agency.linkSlug}#signup" data-agency-join-link="${agency.linkSlug}">/join/${agency.linkSlug}</a></strong></div>
      <div><span>\uC601\uC5C5\uBE44\uC728 / \uC0C1\uD0DC</span><strong>${agency.commissionRate}% \xB7 ${agency.status}</strong></div>
      <div><span>\uACC4\uC57D \uAE30\uAC04</span><strong>${formatAgencyContractPeriod(agency)}</strong></div>
      <div><span>\uB2F4\uB2F9\uC790</span><strong>${agency.managerName || "\uBBF8\uB4F1\uB85D"}</strong></div>
      <div><span>\uC815\uC0B0 \uACC4\uC88C</span><strong>${agency.settlementAccount || "\uBBF8\uB4F1\uB85D"}</strong></div>
      <div><span>\uB9C1\uD06C \uBCF5\uC0AC</span><button class="cart-button mini-button" type="button" data-copy-agency-link="${escapeAttribute(link)}">\uBCF5\uC0AC</button></div>
    </article>
  `;
  }
  function createAgencyAdminWorkspace(store) {
    const rows = store.agencies
      .map((agency) => createAgencyManageRow(agency, store))
      .join("");
    return `
    <section class="agency-admin-workspace" data-agency-workspace>
      <div class="agency-admin-toolbar">
        <div>
          <div class="product-category">Agency list</div>
          <strong>\uB300\uB9AC\uC810 \uC6B4\uC601 \uD604\uD669</strong>
          <span>\uB300\uB9AC\uC810\uBA85 \uD074\uB9AD \uC2DC \uC0C1\uC138 \uC815\uBCF4\uB85C \uC774\uB3D9\uD569\uB2C8\uB2E4.</span>
        </div>
        <button class="buy-button" type="button" data-agency-create>\uB300\uB9AC\uC810 \uCD94\uAC00</button>
      </div>
      ${createAgencyAdminForm({ hidden: true })}
      <div class="agency-table-head">
        <span>\uB300\uB9AC\uC810</span>
        <span>\uC774\uB2EC \uB9E4\uCD9C</span>
        <span>\uC601\uC5C5\uBE44 \uC608\uC815</span>
        <span>\uCD1D\uD68C\uC6D0\uC218</span>
        <span>\uC0C1\uD0DC</span>
        <span>\uAD00\uB9AC</span>
      </div>
      <div class="agency-admin-list">
        ${rows || '<div class="admin-detail-empty">\uB4F1\uB85D\uB41C \uB300\uB9AC\uC810\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.</div>'}
      </div>
    </section>
  `;
  }
  function createAgencyAdminProfileDetail(agencyId, store) {
    const agency = store.agencies.find((item) => item.id === agencyId);
    if (!agency) {
      return '<div class="admin-detail-empty">\uB300\uB9AC\uC810 \uC815\uBCF4\uB97C \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.</div>';
    }
    const metrics = getAgencyAdminMetrics(agency, store);
    const link = createAgencyPublicLink(agency);
    return `
    <div class="detail-panel-head">
      <div>
        <button class="back-button member-detail-back" type="button" data-agency-list-back>\u2190 \uB300\uB9AC\uC810 \uB9AC\uC2A4\uD2B8</button>
        <div class="product-category">Admin agency / ${agency.status}</div>
        <h2 id="adminModalTitle">${agency.name}</h2>
      </div>
      <p>\uB300\uB9AC\uC810 \uACC4\uC57D, \uB9E4\uCD9C, \uC601\uC5C5\uBE44, \uD68C\uC6D0, \uB85C\uADF8\uC778 \uACC4\uC815 \uC815\uBCF4\uB97C \uD55C \uD654\uBA74\uC5D0\uC11C \uD655\uC778\uD569\uB2C8\uB2E4.</p>
    </div>
    <div class="member-detail-grid agency-admin-detail-grid">
      <article><span>\uC774\uB2EC \uB9E4\uCD9C</span><strong>${formatMoney(metrics.monthSales)}</strong></article>
      <article><span>\uC774\uB2EC \uC601\uC5C5\uBE44</span><strong>${formatMoney(metrics.monthCommission)}</strong></article>
      <article><span>\uCD1D\uD68C\uC6D0\uC218</span><strong>${metrics.memberCount}\uBA85</strong></article>
      <article><span>\uAD6C\uB9E4 \uD68C\uC6D0</span><strong>${metrics.buyerCount}\uBA85</strong></article>
      <article><span>\uB204\uC801 \uB9E4\uCD9C</span><strong>${formatMoney(metrics.totalSales)}</strong></article>
      <article><span>\uB204\uC801 \uC601\uC5C5\uBE44</span><strong>${formatMoney(metrics.totalCommission)}</strong></article>
      <article><span>\uC815\uC0B0 \uB300\uAE30</span><strong>${formatMoney(metrics.pendingCommission)}</strong></article>
      <article><span>\uC601\uC5C5\uBE44\uC728</span><strong>${agency.commissionRate}%</strong></article>
      <article><span>\uB300\uB9AC\uC810 \uCF54\uB4DC</span><strong>${agency.code}</strong></article>
      <article><span>\uC804\uC6A9 \uB9C1\uD06C</span><strong><a href="?agency=${agency.linkSlug}#signup" data-agency-join-link="${agency.linkSlug}">/join/${agency.linkSlug}</a></strong></article>
      <article><span>\uC804\uCCB4 \uB9C1\uD06C</span><button class="cart-button mini-button" type="button" data-copy-agency-link="${escapeAttribute(link)}">\uB9C1\uD06C \uBCF5\uC0AC</button></article>
      <article><span>\uB85C\uADF8\uC778 ID</span><strong>${agency.loginUserId || "\uBBF8\uB4F1\uB85D"}</strong></article>
      <article><span>\uACC4\uC57D \uAE30\uAC04</span><strong>${formatAgencyContractPeriod(agency)}</strong></article>
      <article><span>\uB2F4\uB2F9\uC790</span><strong>${agency.managerName || "\uBBF8\uB4F1\uB85D"}</strong></article>
      <article><span>\uB2F4\uB2F9 \uC5F0\uB77D\uCC98</span><strong>${agency.managerPhone || "\uBBF8\uB4F1\uB85D"}</strong></article>
      <article><span>\uC815\uC0B0 \uACC4\uC88C</span><strong>${agency.settlementAccount || "\uBBF8\uB4F1\uB85D"}</strong></article>
    </div>
    <div class="member-detail-columns">
      <section>
        <div class="product-category">\uCD5C\uADFC \uC8FC\uBB38</div>
        <div class="process-list">
          ${
            metrics.orders
              .slice(0, 10)
              .map((order) => createOrderDetailRow(order, store))
              .join("") ||
            '<div class="admin-detail-empty">\uC8FC\uBB38\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.</div>'
          }
        </div>
      </section>
      <section>
        <div class="product-category">\uC815\uC0B0 \uC7A5\uBD80</div>
        <div class="process-list">
          ${
            metrics.settlements
              .slice(0, 10)
              .map((item) =>
                createSettlementDetailRow(item, store, {
                  allowStatusActions: true,
                }),
              )
              .join("") ||
            '<div class="admin-detail-empty">\uC815\uC0B0 \uC7A5\uBD80\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4.</div>'
          }
        </div>
      </section>
    </div>
  `;
  }
  function createMemberDetailRow(member, store) {
    const agency = store.agencies.find((item) => item.id === member.agencyId);
    const orders = store.orders.filter((order) => order.memberId === member.id);
    return `
    <article class="process-row">
      <div>
        <button class="member-detail-button" type="button" data-member-detail="${member.id}">
          ${member.name}
        </button>
        <span>${member.phone || "\uC5F0\uB77D\uCC98 \uC5C6\uC74C"}</span>
      </div>
      <div><span>\uBCF4\uC720 \uD3EC\uC778\uD2B8</span><strong>${member.points.toLocaleString("ko-KR")}P</strong></div>
      <div><span>\uC8FC\uBB38 \uC218</span><strong>${orders.length}\uAC74</strong></div>
      <div><span>\uB0B4\uBD80 \uB300\uB9AC\uC810</span><strong>${(agency == null ? void 0 : agency.name) || "\uBCF8\uC0AC"}</strong></div>
    </article>
  `;
  }
  function createMemberProfileDetail(memberId, store, scope, backType) {
    const member = store.members.find((item) => item.id === memberId);
    if (!member) {
      return '<div class="admin-detail-empty">\uD68C\uC6D0 \uC815\uBCF4\uB97C \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.</div>';
    }
    const agency = store.agencies.find((item) => item.id === member.agencyId);
    const orders = store.orders.filter((order) => order.memberId === member.id);
    const points = store.pointLedger.filter(
      (point) => point.memberId === member.id,
    );
    const links = store.personalReferralLinks.filter(
      (link) => link.ownerMemberId === member.id,
    );
    const isAdmin = scope === "admin";
    return `
    <div class="detail-panel-head">
      <div>
        <button class="back-button member-detail-back" type="button" data-member-detail-back="${backType}">\u2190 \uD68C\uC6D0 \uB9AC\uC2A4\uD2B8</button>
        <div class="product-category">${isAdmin ? "Admin" : "Agency"} member / ${member.userId || member.id}</div>
        <h2 id="adminModalTitle">${member.name}</h2>
      </div>
      <p>
        \uD68C\uC6D0 \uAE30\uBCF8 \uC815\uBCF4, \uBC30\uC1A1\uC9C0, \uAD6C\uB9E4\uC774\uB825, \uD3EC\uC778\uD2B8 \uC774\uB825\uC744 \uD55C \uD654\uBA74\uC5D0\uC11C \uD655\uC778\uD569\uB2C8\uB2E4.
        ${isAdmin ? "\uAD00\uB9AC\uC790 \uD654\uBA74\uC5D0\uC11C\uB294 \uB0B4\uBD80 \uB300\uB9AC\uC810 \uADC0\uC18D \uC815\uBCF4\uB3C4 \uD568\uAED8 \uD45C\uC2DC\uB429\uB2C8\uB2E4." : "\uB300\uB9AC\uC810 \uD654\uBA74\uC5D0\uC11C\uB294 \uC18C\uC18D \uACE0\uAC1D\uC758 \uC8FC\uBB38/\uD3EC\uC778\uD2B8 \uC911\uC2EC\uC73C\uB85C \uD45C\uC2DC\uB429\uB2C8\uB2E4."}
      </p>
    </div>
    <div class="member-detail-grid">
      <article><span>\uC544\uC774\uB514</span><strong>${member.userId || "-"}</strong></article>
      <article><span>\uC0C1\uD0DC</span><strong>${member.status}</strong></article>
      <article><span>\uAC00\uC785\uC77C</span><strong>${member.joinedAt || "-"}</strong></article>
      <article><span>\uBCF4\uC720 \uD3EC\uC778\uD2B8</span><strong>${member.points.toLocaleString("ko-KR")}P</strong></article>
      <article><span>\uD734\uB300\uD3F0</span><strong>${member.phone || "-"}</strong></article>
      <article><span>\uC774\uBA54\uC77C</span><strong>${member.email || "-"}</strong></article>
      <article><span>\uC8FC\uBB38 \uC218</span><strong>${orders.length}\uAC74</strong></article>
      <article><span>\uCD94\uCC9C \uB9C1\uD06C</span><strong>${links.length}\uAC1C</strong></article>
      ${isAdmin ? `<article><span>\uB0B4\uBD80 \uB300\uB9AC\uC810</span><strong>${(agency == null ? void 0 : agency.name) || "\uBCF8\uC0AC"}</strong></article>` : ""}
      <article class="member-detail-wide"><span>\uBC30\uC1A1\uC9C0</span><strong>${formatAddress(member.address)}</strong></article>
    </div>
    <div class="member-detail-columns">
      <section>
        <div class="product-category">\uAD6C\uB9E4\uC774\uB825</div>
        <div class="process-list">
          ${orders.map(createMemberOrderRow).join("") || '<div class="admin-detail-empty">\uAD6C\uB9E4\uC774\uB825\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.</div>'}
        </div>
      </section>
      <section>
        <div class="product-category">\uD3EC\uC778\uD2B8 \uC801\uB9BD/\uC0AC\uC6A9 \uC774\uB825</div>
        <div class="process-list">
          ${points.map(createMemberPointRow).join("") || '<div class="admin-detail-empty">\uD3EC\uC778\uD2B8 \uC774\uB825\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.</div>'}
        </div>
      </section>
    </div>
    <form class="member-memo-form" data-member-memo-form="${member.id}">
      <div class="product-category">Internal memo</div>
      <label>
        \uAD00\uB9AC\uC790/\uB300\uB9AC\uC810 \uBA54\uBAA8
        <textarea class="quantity-input" name="internalMemo" rows="5" placeholder="\uC0C1\uB2F4 \uB0B4\uC6A9, \uBC30\uC1A1 \uC694\uCCAD, \uACE0\uAC1D \uAD00\uB9AC \uBA54\uBAA8\uB97C \uC785\uB825\uD558\uC138\uC694.">${escapeTextarea(member.internalMemo)}</textarea>
      </label>
      <button class="buy-button mini-button" type="submit">\uBA54\uBAA8 \uC800\uC7A5</button>
    </form>
  `;
  }
  function createMemberOrderRow(order) {
    var _a;
    const firstItem = (_a = order.items) == null ? void 0 : _a[0];
    return `
    <article class="process-row member-history-row">
      <div><strong>${order.id}</strong><span>${order.paidAt} \xB7 ${order.status}</span></div>
      <div><span>\uB300\uD45C \uC0C1\uD488</span><strong>${(firstItem == null ? void 0 : firstItem.productKo) || "\uC0C1\uD488"}</strong></div>
      <div><span>\uC0C1\uD488 \uC2E4\uACB0\uC81C</span><strong>${formatMoney(order.paidProductAmount)}</strong></div>
      <div><span>\uBC30\uC1A1\uBE44</span><strong>${order.shippingAmount ? formatMoney(order.shippingAmount) : "\uBB34\uB8CC"}</strong></div>
    </article>
  `;
  }
  function createMemberPointRow(point) {
    return `
    <article class="process-row member-history-row">
      <div><strong>${point.orderId}</strong><span>${point.note}</span></div>
      <div><span>\uAD6C\uBD84</span><strong>${point.type}</strong></div>
      <div><span>\uAE30\uC900 \uAE08\uC561</span><strong>${formatMoney(point.baseAmount)}</strong></div>
      <div><span>\uD3EC\uC778\uD2B8</span><strong>${point.amount.toLocaleString("ko-KR")}P</strong></div>
    </article>
  `;
  }
  function formatAddress(address = {}) {
    const parts = [
      address.postcode,
      address.address,
      address.addressDetail,
    ].filter(Boolean);
    return parts.length ? parts.join(" ") : "-";
  }
  function escapeTextarea(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
  function escapeAttribute(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
  function getCurrentMonthKey() {
    return /* @__PURE__ */ new Date().toISOString().slice(0, 7);
  }
  function getRecentMonthKeys(count = 6) {
    const start = /* @__PURE__ */ new Date(
      `${getCurrentMonthKey()}-01T00:00:00`,
    );
    return Array.from({ length: count }, (_, index) => {
      const date = new Date(start);
      date.setMonth(start.getMonth() - index);
      return date.toISOString().slice(0, 7);
    });
  }
  function isCurrentMonthDate(value) {
    return String(value || "").startsWith(getCurrentMonthKey());
  }
  function isMonthDate(value, monthKey) {
    return String(value || "").startsWith(monthKey);
  }
  function getCurrentMonthOrders(store) {
    return store.orders.filter(
      (order) => order.status === "paid" && isCurrentMonthDate(order.paidAt),
    );
  }
  function getCurrentMonthPoints(store) {
    return store.pointLedger.filter((point) => {
      const dateValue = point.createdAt || point.paidAt || "";
      return isCurrentMonthDate(dateValue);
    });
  }
  function isPointUse(point) {
    return point.amount < 0 || String(point.type || "").includes("use");
  }
  function getCurrentMonthPointSummary(store) {
    return getCurrentMonthPoints(store).reduce(
      (summary, point) => {
        if (isPointUse(point)) {
          summary.used += Math.abs(point.amount);
        } else {
          summary.earned += Math.max(0, point.amount);
        }
        return summary;
      },
      { earned: 0, used: 0 },
    );
  }
  function createOrderDetailRow(order, store) {
    const point = store.pointLedger.find((item) => item.orderId === order.id);
    const settlement = store.agencySettlementLedger.find(
      (item) => item.orderId === order.id,
    );
    return `
    <article class="process-row">
      <div><strong>${order.id}</strong><span>${order.status} \xB7 ${order.paidAt}</span></div>
      <div><span>\uC0C1\uD488 \uC2E4\uACB0\uC81C</span><strong>${formatMoney(order.paidProductAmount)}</strong></div>
      <div><span>\uD3EC\uC778\uD2B8 \uC801\uB9BD</span><strong>${((point == null ? void 0 : point.amount) || 0).toLocaleString("ko-KR")}P</strong></div>
      <div><span>\uB300\uB9AC\uC810 \uC601\uC5C5\uBE44</span><strong>${formatMoney((settlement == null ? void 0 : settlement.commissionAmount) || 0)}</strong></div>
    </article>
  `;
  }
  function createPointDetailRow(point) {
    return `
    <article class="process-row">
      <div><strong>${point.orderId}</strong><span>${point.note}</span></div>
      <div><span>\uAE30\uC900 \uAE08\uC561</span><strong>${formatMoney(point.baseAmount)}</strong></div>
      <div><span>\uC801\uB9BD\uB960</span><strong>${point.rate}%</strong></div>
      <div><span>\uD3EC\uC778\uD2B8</span><strong>${point.amount.toLocaleString("ko-KR")}P</strong></div>
    </article>
  `;
  }
  function createMonthlyAgencySalesRows(store) {
    const monthlyOrders = getCurrentMonthOrders(store);
    return store.agencies.map((agency) => {
      const agencyOrders = monthlyOrders.filter(
        (order) => order.agencyIdAtOrder === agency.id,
      );
      const amount = agencyOrders.reduce(
        (sum, order) => sum + order.paidProductAmount,
        0,
      );
      const commissionRate = agency.commissionRate || 0;
      const commission = Math.floor(amount * (commissionRate / 100));
      return `
      <article class="process-row">
        <div><strong>${agency.name}</strong><span>${agency.code} \xB7 ${agency.status}</span></div>
        <div><span>\uC774\uB2EC \uC8FC\uBB38</span><strong>${agencyOrders.length}\uAC74</strong></div>
        <div><span>\uB204\uC801 \uC0C1\uD488\uAE08\uC561</span><strong>${formatMoney(amount)}</strong></div>
        <div><span>\uC608\uC0C1 \uC601\uC5C5\uBE44</span><strong>${formatMoney(commission)}</strong></div>
      </article>
    `;
    });
  }
  function createAdminOrderShippingWorkspace(store) {
    const orders = [...(store.orders || [])].sort((a, b) =>
      String(b.paidAt || "").localeCompare(String(a.paidAt || "")),
    );
    return `
    <section class="shipment-workspace">
      <div class="product-category">Agency monthly summary</div>
      <div class="process-list shipment-summary-list">
        ${createMonthlyAgencySalesRows(store).join("")}
      </div>
      <div class="shipment-head">
        <div>
          <div class="product-category">Shipment control</div>
          <strong>\uC8FC\uBB38\uBCC4 \uBC30\uC1A1 / \uC1A1\uC7A5 \uAD00\uB9AC</strong>
        </div>
        <span>\uC1A1\uC7A5\uBC88\uD638 \uC800\uC7A5 \uC2DC \uACE0\uAC1D \uC8FC\uBB38 \uC0C1\uC138\uC5D0\uB3C4 \uBC14\uB85C \uBC18\uC601\uB429\uB2C8\uB2E4.</span>
      </div>
      <div class="shipment-list">
        ${orders.map((order) => createAdminShipmentRow(order, store)).join("") || '<div class="admin-detail-empty">\uAD00\uB9AC\uD560 \uC8FC\uBB38\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.</div>'}
      </div>
    </section>
  `;
  }
  function createAdminShipmentRow(order, store) {
    var _a;
    const member = store.members.find((item) => item.id === order.memberId);
    const address =
      order.shippingAddress || (member == null ? void 0 : member.address) || {};
    const firstItem = (_a = order.items) == null ? void 0 : _a[0];
    return `
    <form class="shipment-row" data-shipment-form="${order.id}">
      <div class="shipment-order-main">
        <strong>${order.id}</strong>
        <span>${order.paidAt || "-"} \xB7 ${(member == null ? void 0 : member.name) || "\uD68C\uC6D0"} \xB7 ${(firstItem == null ? void 0 : firstItem.productKo) || "\uC0C1\uD488"}</span>
        <em>${formatShipmentAddress(address)}</em>
      </div>
      <label>\uBC30\uC1A1\uC0C1\uD0DC
        <select class="option-select" name="shippingStatus">
          ${createOption("preparing", "\uC0C1\uD488\uC900\uBE44", order.shippingStatus)}
          ${createOption("paid", "\uACB0\uC81C\uC644\uB8CC", order.shippingStatus)}
          ${createOption("shipping", "\uBC30\uC1A1\uC911", order.shippingStatus)}
          ${createOption("delivered", "\uBC30\uC1A1\uC644\uB8CC", order.shippingStatus)}
          ${createOption("returned", "\uCDE8\uC18C/\uBC18\uD488", order.shippingStatus)}
        </select>
      </label>
      <label>\uD0DD\uBC30\uC0AC
        <select class="option-select" name="courier">
          ${createOption("", "\uC120\uD0DD", order.courier)}
          ${createOption("CJ\uB300\uD55C\uD1B5\uC6B4", "CJ\uB300\uD55C\uD1B5\uC6B4", order.courier)}
          ${createOption("\uB86F\uB370\uD0DD\uBC30", "\uB86F\uB370\uD0DD\uBC30", order.courier)}
          ${createOption("\uD55C\uC9C4\uD0DD\uBC30", "\uD55C\uC9C4\uD0DD\uBC30", order.courier)}
          ${createOption("\uC6B0\uCCB4\uAD6D\uD0DD\uBC30", "\uC6B0\uCCB4\uAD6D\uD0DD\uBC30", order.courier)}
        </select>
      </label>
      <label>\uC1A1\uC7A5\uBC88\uD638<input class="quantity-input" name="trackingNumber" value="${escapeAttribute(order.trackingNumber)}" placeholder="\uC1A1\uC7A5\uBC88\uD638 \uC785\uB825" /></label>
      <label>\uCD9C\uACE0\uC77C<input class="quantity-input" name="shippedAt" type="date" value="${escapeAttribute(order.shippedAt)}" /></label>
      <label>\uC644\uB8CC\uC77C<input class="quantity-input" name="deliveredAt" type="date" value="${escapeAttribute(order.deliveredAt)}" /></label>
      <label class="shipment-memo">\uBC30\uC1A1 \uBA54\uBAA8<input class="quantity-input" name="shippingMemo" value="${escapeAttribute(order.shippingMemo)}" placeholder="\uBC30\uC1A1 \uC694\uCCAD/\uD2B9\uC774\uC0AC\uD56D" /></label>
      <button class="buy-button mini-button" type="submit">\uBC30\uC1A1 \uC800\uC7A5</button>
    </form>
  `;
  }
  function createOption(value, label, selectedValue) {
    return `<option value="${escapeAttribute(value)}" ${String(value) === String(selectedValue || "") ? "selected" : ""}>${label}</option>`;
  }
  function formatShipmentAddress(address = {}) {
    const recipient = [address.recipient, address.phone]
      .filter(Boolean)
      .join(" / ");
    const addressText = formatAddress(address);
    return [recipient, addressText].filter(Boolean).join(" \xB7 ");
  }
  function createMonthlyPointSummary(store) {
    const summary = getCurrentMonthPointSummary(store);
    return `
    <div class="management-grid compact monthly-point-summary">
      <article><span>\uC774\uB2EC \uC801\uB9BD\uD3EC\uC778\uD2B8</span><strong>${summary.earned.toLocaleString("ko-KR")}P</strong></article>
      <article><span>\uC774\uB2EC \uC0AC\uC6A9\uD3EC\uC778\uD2B8</span><strong>${summary.used.toLocaleString("ko-KR")}P</strong></article>
      <article><span>\uC21C\uC99D\uAC10</span><strong>${(summary.earned - summary.used).toLocaleString("ko-KR")}P</strong></article>
    </div>
  `;
  }
  function createSettlementDetailRow(item, store, options = {}) {
    const agency = store.agencies.find(
      (agencyItem) => agencyItem.id === item.agencyId,
    );
    const actions = options.allowStatusActions
      ? [
          ["pending_next_month_15", "\uB300\uAE30"],
          ["confirmed", "\uD655\uC815"],
          ["paid", "\uC9C0\uAE09\uC644\uB8CC"],
          ["hold", "\uBCF4\uB958"],
        ]
          .map(
            ([status, label]) =>
              `<button class="cart-button mini-button" type="button" data-settlement-status="${item.id}" data-status-value="${status}">${label}</button>`,
          )
          .join("")
      : "";
    return `
    <article class="process-row">
      <div><strong>${item.orderId}</strong><span>${(agency == null ? void 0 : agency.name) || "\uB300\uB9AC\uC810"} \xB7 ${item.status}</span></div>
      <div><span>\uAE30\uC900 \uB9E4\uCD9C</span><strong>${formatMoney(item.baseAmount)}</strong></div>
      <div><span>\uC601\uC5C5\uBE44\uC728</span><strong>${item.commissionRate}%</strong></div>
      <div><span>\uC9C0\uAE09 \uC608\uC815</span><strong>${formatMoney(item.commissionAmount)}</strong></div>
      <div><span>\uCD5C\uADFC \uBCC0\uACBD</span><strong>${formatSettlementUpdate(item)}</strong></div>
      ${actions ? `<div class="settlement-actions"><span>\uC0C1\uD0DC \uBCC0\uACBD</span><strong>${actions}</strong></div>` : ""}
    </article>
  `;
  }
  function formatSettlementUpdate(item) {
    if (!item.updatedAt && !item.statusUpdatedBy)
      return "\uBCC0\uACBD \uC774\uB825 \uC5C6\uC74C";
    return `${item.updatedAt || "-"} \xB7 ${item.statusUpdatedBy || "admin"}`;
  }
  function getSettlementStatusLabel(status) {
    const labels = {
      pending_next_month_15: "\uC815\uC0B0 \uB300\uAE30",
      confirmed: "\uC815\uC0B0 \uD655\uC815",
      paid: "\uC9C0\uAE09\uC644\uB8CC",
      hold: "\uC815\uC0B0 \uBCF4\uB958",
    };
    return labels[status] || status;
  }
  function createSimpleDetailRow(title, value, note) {
    return `
    <article class="process-row">
      <div><strong>${title}</strong><span>${note}</span></div>
      <div><span>\uAC12</span><strong>${value}</strong></div>
      <div><span>\uC0C1\uD0DC</span><strong>active</strong></div>
      <div><span>\uAD00\uB9AC</span><strong>\uB0B4\uBD80 \uAD00\uB9AC\uC6A9</strong></div>
    </article>
  `;
  }
  function createAgencyLinkDetailRow(agency) {
    const link = createAgencyPublicLink(agency);
    return `
    <article class="process-row">
      <div><strong>\uB300\uB9AC\uC810 \uAC00\uC785 \uB9C1\uD06C</strong><span>\uD68C\uC6D0\uAC00\uC785 \uC2DC \uB300\uB9AC\uC810 \uCF54\uB4DC \uC790\uB3D9 \uB4F1\uB85D</span></div>
      <div><span>\uB9C1\uD06C</span><strong><a href="?agency=${agency.linkSlug}#signup" data-agency-join-link="${agency.linkSlug}">/join/${agency.linkSlug}</a></strong></div>
      <div><span>\uB300\uB9AC\uC810 \uCF54\uB4DC</span><strong>${agency.code}</strong></div>
      <div><span>\uC0C1\uD0DC</span><strong>${agency.status}</strong></div>
      <div><span>\uBCF5\uC0AC</span><button class="cart-button mini-button" type="button" data-copy-agency-link="${escapeAttribute(link)}">\uB9C1\uD06C \uBCF5\uC0AC</button></div>
    </article>
  `;
  }
  function createAgencyPerformanceRow(performance) {
    return `
    <article class="process-row">
      <div><strong>${performance.members}\uBA85</strong><span>\uB300\uB9AC\uC810 \uCF54\uB4DC \uADC0\uC18D \uD68C\uC6D0</span></div>
      <div><span>\uAD6C\uB9E4 \uC804\uD658 \uD68C\uC6D0</span><strong>${performance.buyers}\uBA85</strong></div>
      <div><span>\uC815\uC0B0 \uB300\uC0C1 \uC8FC\uBB38</span><strong>${performance.orders}\uAC74</strong></div>
      <div><span>\uC804\uD658\uC728</span><strong>${performance.conversionRate}%</strong></div>
    </article>
  `;
  }
  function createAgencyMonthSummary(agency, orders, settlements, monthKey) {
    const monthOrders = orders.filter((order) =>
      isMonthDate(order.paidAt, monthKey),
    );
    const monthSettlements = settlements.filter((item) =>
      isMonthDate(item.createdAt, monthKey),
    );
    const amount = monthOrders.reduce(
      (sum, order) => sum + order.paidProductAmount,
      0,
    );
    const commission = monthSettlements.reduce(
      (sum, item) => sum + item.commissionAmount,
      0,
    );
    return `
    <div class="management-grid compact monthly-point-summary">
      <article><span>\uB300\uC0C1 \uC6D4</span><strong>${monthKey}</strong></article>
      <article><span>\uB300\uB9AC\uC810</span><strong>${agency.name}</strong></article>
      <article><span>\uC815\uC0B0\uB9E4\uCD9C</span><strong>${formatMoney(amount)}</strong></article>
      <article><span>\uC608\uC0C1 \uC601\uC5C5\uBE44</span><strong>${formatMoney(commission)}</strong></article>
    </div>
  `;
  }
  function createAgencySixMonthSummary(agency, orders, settlements) {
    return `
    <div class="agency-month-grid" aria-label="\uCD5C\uADFC 6\uAC1C\uC6D4 \uC815\uC0B0 \uC694\uC57D">
      ${getRecentMonthKeys(6)
        .map((monthKey) =>
          createAgencyMonthCard(agency, orders, settlements, monthKey),
        )
        .join("")}
    </div>
  `;
  }
  function createAgencyMonthCard(agency, orders, settlements, monthKey) {
    const monthOrders = orders.filter((order) =>
      isMonthDate(order.paidAt, monthKey),
    );
    const monthSettlements = settlements.filter((item) =>
      isMonthDate(item.createdAt, monthKey),
    );
    const amount = monthOrders.reduce(
      (sum, order) => sum + order.paidProductAmount,
      0,
    );
    const commission = monthSettlements.reduce(
      (sum, item) => sum + item.commissionAmount,
      0,
    );
    const status = getSettlementStatusSummary(monthSettlements);
    return `
    <button class="agency-month-card" type="button" data-agency-month="${monthKey}">
      <span>${agency.code} / ${monthKey}</span>
      <strong>${formatMoney(amount)}</strong>
      <em>\uC601\uC5C5\uBE44 ${formatMoney(commission)} \xB7 ${monthOrders.length}\uAC74 \xB7 ${status}</em>
    </button>
  `;
  }
  function createAgencyMonthDetailContent(monthKey, store) {
    const agency = getAgencyContext(store);
    if (!agency)
      return '<div class="admin-detail-empty">\uB300\uB9AC\uC810 \uC815\uBCF4\uB97C \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.</div>';
    const orders = store.orders.filter(
      (order) =>
        order.agencyIdAtOrder === agency.id &&
        order.referralSourceType !== "personal_product",
    );
    const excludedOrders = store.orders.filter(
      (order) =>
        order.agencyIdAtOrder === agency.id &&
        order.referralSourceType === "personal_product",
    );
    const settlements = store.agencySettlementLedger.filter(
      (item) => item.agencyId === agency.id,
    );
    const monthOrders = orders.filter((order) =>
      isMonthDate(order.paidAt, monthKey),
    );
    const monthSettlements = settlements.filter((item) =>
      isMonthDate(item.createdAt, monthKey),
    );
    return `
    <div class="detail-panel-head">
      <div>
        <button class="back-button member-detail-back" type="button" data-agency-month-back>\u2190 \uCD5C\uADFC 6\uAC1C\uC6D4</button>
        <div class="product-category">Agency settlement / ${monthKey}</div>
        <h2 id="adminModalTitle">${monthKey} \uC815\uC0B0 \uC0C1\uC138</h2>
      </div>
      <p>\uD574\uB2F9 \uC6D4\uC758 \uBC30\uC1A1\uBE44 \uC81C\uC678 \uC2E4\uACB0\uC81C \uC0C1\uD488\uAE08\uC561\uACFC \uC601\uC5C5\uBE44 \uC608\uC815 \uC7A5\uBD80\uC785\uB2C8\uB2E4.</p>
    </div>
    <div class="process-list">
      ${createAgencyMonthSummary(agency, orders, settlements, monthKey)}
      <div class="product-category">\uC6D4\uBCC4 \uC8FC\uBB38</div>
      ${monthOrders.map((order) => createOrderDetailRow(order, store)).join("") || '<div class="admin-detail-empty">\uD574\uB2F9 \uC6D4 \uC8FC\uBB38\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.</div>'}
      <div class="product-category">\uC6D4\uBCC4 \uC815\uC0B0 \uC7A5\uBD80</div>
      ${monthSettlements.map((item) => createSettlementDetailRow(item, store)).join("") || '<div class="admin-detail-empty">\uD574\uB2F9 \uC6D4 \uC815\uC0B0 \uC7A5\uBD80\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4.</div>'}
      <div class="product-category">\uC815\uC0B0 \uC81C\uC678 \uC8FC\uBB38</div>
      ${
        excludedOrders
          .filter((order) => isMonthDate(order.paidAt, monthKey))
          .map(createExcludedSettlementOrderRow)
          .join("") ||
        '<div class="admin-detail-empty">\uD574\uB2F9 \uC6D4 \uC815\uC0B0 \uC81C\uC678 \uC8FC\uBB38\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.</div>'
      }
    </div>
  `;
  }
  function createExcludedSettlementOrderRow(order) {
    return `
    <article class="process-row">
      <div><strong>${order.id}</strong><span>${order.paidAt} \xB7 ${order.status}</span></div>
      <div><span>\uC0C1\uD488 \uC2E4\uACB0\uC81C</span><strong>${formatMoney(order.paidProductAmount)}</strong></div>
      <div><span>\uC81C\uC678 \uC0AC\uC720</span><strong>\uAC1C\uC778 \uCD94\uCC9C\uB9C1\uD06C \uC6B0\uC120 \uC801\uC6A9</strong></div>
      <div><span>\uB300\uB9AC\uC810 \uC601\uC5C5\uBE44</span><strong>0\uC6D0</strong></div>
    </article>
  `;
  }
  function getAgencyContext(store) {
    const currentMember = getCurrentMember(store);
    const memberAgency = store.agencies.find(
      (agency) =>
        agency.id === (currentMember == null ? void 0 : currentMember.agencyId),
    );
    if (memberAgency && !memberAgency.isHeadquarters) return memberAgency;
    return (
      store.agencies.find((agency) => !agency.isHeadquarters) ||
      store.agencies.find((agency) => agency.isHeadquarters)
    );
  }
  function getCurrentMember(store) {
    return store.members.find((member) => member.id === store.currentMemberId);
  }
  function getAgencyLinkPerformance(agency, store) {
    const members = store.members.filter(
      (member) => member.agencyId === agency.id,
    );
    const memberIds = new Set(members.map((member) => member.id));
    const orders = store.orders.filter(
      (order) =>
        order.agencyIdAtOrder === agency.id &&
        order.referralSourceType !== "personal_product",
    );
    const buyerIds = new Set(
      orders
        .map((order) => order.memberId)
        .filter((memberId) => memberIds.has(memberId)),
    );
    const conversionRate = members.length
      ? Math.round((buyerIds.size / members.length) * 100)
      : 0;
    return {
      members: members.length,
      buyers: buyerIds.size,
      orders: orders.length,
      conversionRate,
    };
  }
  function getSettlementStatusSummary(settlements) {
    if (!settlements.length) return "\uB300\uAE30 \uC5C6\uC74C";
    const paid = settlements.filter((item) => item.status === "paid").length;
    const hold = settlements.filter((item) => item.status === "hold").length;
    const confirmed = settlements.filter(
      (item) => item.status === "confirmed",
    ).length;
    const pending = settlements.length - paid - hold - confirmed;
    if (hold) return `\uBCF4\uB958 ${hold}\uAC74`;
    if (pending) return `\uB300\uAE30 ${pending}\uAC74`;
    if (confirmed) return `\uD655\uC815 ${confirmed}\uAC74`;
    return `\uC9C0\uAE09\uC644\uB8CC ${paid}\uAC74`;
  }
  function createAgencyPublicLink(agency) {
    const location = window.location || {};
    const isHttp = /^https?:\/\//.test(location.origin || "");
    const origin = isHttp ? location.origin : "http://localhost:8000";
    const path = isHttp ? location.pathname || "/" : "/";
    return `${origin}${path}?agency=${encodeURIComponent(agency.linkSlug)}#signup`;
  }
  function formatAgencyContractPeriod(agency) {
    if (!agency.contractStart && !agency.contractEnd)
      return "\uBBF8\uB4F1\uB85D";
    return `${agency.contractStart || "\uC2DC\uC791\uC77C \uBBF8\uB4F1\uB85D"} ~ ${agency.contractEnd || "\uC885\uB8CC\uC77C \uBBF8\uB4F1\uB85D"}`;
  }
  function createEmptyAgencyDashboard() {
    return `
    <section class="management-dashboard">
      <div class="management-head">
        <div>
          <div class="product-category">Agency</div>
          <h1 class="detail-title">Agency Desk.</h1>
        </div>
        <p>\uD45C\uC2DC\uD560 \uB300\uB9AC\uC810 \uC815\uBCF4\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4.</p>
      </div>
    </section>
  `;
  }
  function createAgencyDashboard(store) {
    const agency = getAgencyContext(store);
    if (!agency) return createEmptyAgencyDashboard();
    const members = store.members.filter(
      (member) => member.agencyId === agency.id,
    );
    const sales = store.orders
      .filter(
        (order) =>
          order.agencyIdAtOrder === agency.id &&
          order.referralSourceType !== "personal_product",
      )
      .reduce((sum, order) => sum + order.paidProductAmount, 0);
    const settlements = store.agencySettlementLedger.filter(
      (item) => item.agencyId === agency.id,
    );
    const commission = settlements.reduce(
      (sum, item) => sum + item.commissionAmount,
      0,
    );
    const monthlyOrders = getCurrentMonthOrders(store).filter(
      (order) =>
        order.agencyIdAtOrder === agency.id &&
        order.referralSourceType !== "personal_product",
    );
    const monthlySales = monthlyOrders.reduce(
      (sum, order) => sum + order.paidProductAmount,
      0,
    );
    const linkPerformance = getAgencyLinkPerformance(agency, store);
    const statusSummary = getSettlementStatusSummary(settlements);
    return `
    <section class="management-dashboard">
      <div class="management-head">
        <div>
          <div class="product-category">Agency / ${agency.code}</div>
          <h1 class="detail-title">Agency Desk.</h1>
        </div>
        <p>\uB300\uB9AC\uC810 \uB9C1\uD06C, \uC18C\uC18D \uACE0\uAC1D, \uB9E4\uCD9C, \uC815\uC0B0 \uC608\uC815\uC561\uC744 \uD655\uC778\uD558\uB294 \uB300\uB9AC\uC810 \uD654\uBA74 \uACE8\uACA9\uC785\uB2C8\uB2E4.</p>
      </div>
      <div class="management-grid">
        ${createMetricCard("agency", "code", "\uC804\uC6A9 \uCF54\uB4DC", agency.code)}
        ${createMetricCard("agency", "link", "\uC804\uC6A9 \uB9C1\uD06C", `/join/${agency.linkSlug}`)}
        ${createMetricCard("agency", "members", "\uC18C\uC18D \uACE0\uAC1D", `${members.length}\uBA85`)}
        ${createMetricCard("agency", "rate", "\uC601\uC5C5\uBE44\uC728", `${agency.commissionRate}%`)}
        ${createAgencySettlementMetric(monthlySales || sales, commission)}
        ${createMetricCard("agency", "performance", "\uB9C1\uD06C \uC131\uACFC", `${linkPerformance.members}\uBA85 / ${linkPerformance.orders}\uAC74`)}
        ${createMetricCard("agency", "status", "\uC815\uC0B0 \uC0C1\uD0DC", statusSummary)}
      </div>
      <section class="management-panel">
        <div class="product-category">Settlement queue</div>
        <div class="process-list">
          ${settlements
            .slice(0, 4)
            .map(
              (item) => `
              <article class="process-row">
                <div><strong>${item.orderId}</strong><span>${item.status}</span></div>
                <div><span>\uAE30\uC900 \uB9E4\uCD9C</span><strong>${formatMoney(item.baseAmount)}</strong></div>
                <div><span>\uC601\uC5C5\uBE44\uC728</span><strong>${item.commissionRate}%</strong></div>
                <div><span>\uC9C0\uAE09 \uC608\uC815</span><strong>${formatMoney(item.commissionAmount)}</strong></div>
              </article>
            `,
            )
            .join("")}
        </div>
      </section>
      ${createDetailModal("agencyDetailModal", "agencyModalContent")}
    </section>
  `;
  }
  function createAgencyDetailContent(type, store) {
    if (String(type || "").startsWith("month:")) {
      return createAgencyMonthDetailContent(
        String(type).replace("month:", ""),
        store,
      );
    }
    const agency = getAgencyContext(store);
    if (!agency)
      return '<div class="admin-detail-empty">\uB300\uB9AC\uC810 \uC815\uBCF4\uB97C \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.</div>';
    const members = store.members.filter(
      (member) => member.agencyId === agency.id,
    );
    const orders = store.orders.filter(
      (order) =>
        order.agencyIdAtOrder === agency.id &&
        order.referralSourceType !== "personal_product",
    );
    const settlements = store.agencySettlementLedger.filter(
      (item) => item.agencyId === agency.id,
    );
    const linkPerformance = getAgencyLinkPerformance(agency, store);
    const details = {
      code: {
        label: "Code",
        title: "\uC804\uC6A9 \uCF54\uB4DC \uC0C1\uC138",
        description:
          "\uD574\uB2F9 \uB300\uB9AC\uC810\uC73C\uB85C \uD68C\uC6D0\uC744 \uADC0\uC18D\uC2DC\uD0A4\uB294 \uB0B4\uBD80 \uB300\uB9AC\uC810 \uCF54\uB4DC\uC785\uB2C8\uB2E4.",
        rows: [createAgencyDetailRow(agency)],
      },
      link: {
        label: "Link",
        title: "\uC804\uC6A9 \uB9C1\uD06C \uC0C1\uC138",
        description:
          "\uC774 \uB9C1\uD06C\uB85C \uAC00\uC785\uD55C \uD68C\uC6D0\uC740 \uACC4\uC18D \uD574\uB2F9 \uB300\uB9AC\uC810 \uACE0\uAC1D\uC73C\uB85C \uCC98\uB9AC\uB429\uB2C8\uB2E4.",
        rows: [createAgencyLinkDetailRow(agency)],
      },
      performance: {
        label: "Performance",
        title: "\uB300\uB9AC\uC810 \uB9C1\uD06C \uC131\uACFC",
        description:
          "\uB300\uB9AC\uC810 \uCF54\uB4DC\uB85C \uADC0\uC18D\uB41C \uD68C\uC6D0 \uC218\uC640 \uAD6C\uB9E4 \uC804\uD658 \uD604\uD669\uC744 \uD655\uC778\uD569\uB2C8\uB2E4.",
        rows: [createAgencyPerformanceRow(linkPerformance)],
      },
      members: {
        label: "Customers",
        title: "\uC18C\uC18D \uACE0\uAC1D \uC0C1\uC138",
        description:
          "\uB300\uB9AC\uC810 \uB9C1\uD06C\uB85C \uAC00\uC785\uB418\uC5B4 \uBCC0\uACBD \uBD88\uAC00 \uC0C1\uD0DC\uC778 \uACE0\uAC1D \uBAA9\uB85D\uC785\uB2C8\uB2E4.",
        rows: members.map((member) => createMemberDetailRow(member, store)),
      },
      rate: {
        label: "Commission rate",
        title: "\uC601\uC5C5\uBE44\uC728 \uC0C1\uC138",
        description:
          "\uC804\uC6D4 \uB300\uB9AC\uC810 \uD68C\uC6D0 \uC2E4\uACB0\uC81C \uC0C1\uD488\uAE08\uC561\uC5D0 \uC801\uC6A9\uB418\uB294 \uB300\uB9AC\uC810\uBCC4 \uC601\uC5C5\uBE44\uC728\uC785\uB2C8\uB2E4.",
        rows: [
          createSimpleDetailRow(
            "\uD604\uC7AC \uC601\uC5C5\uBE44\uC728",
            `${agency.commissionRate}%`,
            "\uB300\uB9AC\uC810\uBCC4 \uAC1C\uBCC4 \uAD00\uB9AC \uAC12",
          ),
        ],
      },
      settlement: {
        label: "Settlement",
        title:
          "\uCD5C\uADFC 6\uAC1C\uC6D4 \uC815\uC0B0\uB9E4\uCD9C / \uC601\uC5C5\uBE44",
        description:
          "\uCD5C\uADFC 6\uAC1C\uC6D4\uC758 \uBC30\uC1A1\uBE44 \uC81C\uC678 \uC2E4\uACB0\uC81C \uC0C1\uD488\uAE08\uC561\uACFC \uC601\uC5C5\uBE44 \uC608\uC815 \uAE08\uC561\uC785\uB2C8\uB2E4. \uC6D4\uC744 \uD074\uB9AD\uD558\uBA74 \uC138\uBD80 \uC8FC\uBB38\uACFC \uC815\uC0B0 \uC7A5\uBD80\uB97C \uD655\uC778\uD569\uB2C8\uB2E4.",
        extra: createAgencySixMonthSummary(agency, orders, settlements),
        rows: [],
      },
      sales: null,
      commission: null,
      status: {
        label: "Status",
        title: "\uC815\uC0B0 \uC0C1\uD0DC \uC0C1\uC138",
        description:
          "\uC775\uC6D4 15\uC77C \uC815\uC0B0 \uCC98\uB9AC \uC804 \uB300\uAE30 \uC0C1\uD0DC\uC758 \uC815\uC0B0 \uC7A5\uBD80\uC785\uB2C8\uB2E4.",
        rows: settlements.map((item) => createSettlementDetailRow(item, store)),
      },
    };
    const detail = details[type] || details.settlement;
    const rows = detail.rows.join("");
    return `
    <div class="detail-panel-head">
      <div>
        <div class="product-category">Agency detail / ${detail.label}</div>
        <h2 id="adminModalTitle">${detail.title}</h2>
      </div>
      <p>${detail.description}</p>
    </div>
    <div class="process-list">
      ${detail.extra || ""}
      ${rows || (detail.extra ? "" : '<div class="admin-detail-empty">\uD45C\uC2DC\uD560 \uB370\uC774\uD130\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4.</div>')}
    </div>
  `;
  }
  function createAgencyAdminForm({ hidden = false } = {}) {
    return `
    <div class="agency-admin-form ${hidden ? "is-hidden" : ""}" data-agency-form>
      <input type="hidden" name="agencyId" />
      <section class="agency-form-section product-required-group">
        <div class="product-form-group-head">
          <strong>\uD544\uC218 \uACC4\uC57D \uC815\uBCF4</strong>
          <span>\uB300\uB9AC\uC810 \uB4F1\uB85D\uACFC \uC815\uC0B0 \uACC4\uC0B0\uC5D0 \uD544\uC694\uD55C \uCD5C\uC18C \uC785\uB825\uAC12</span>
        </div>
        <div class="required-form-note">
          <strong>\uD544\uC218</strong>
          <span>\uB300\uB9AC\uC810\uBA85, \uB300\uB9AC\uC810 \uCF54\uB4DC, \uC804\uC6A9 \uB9C1\uD06C, \uC601\uC5C5\uBE44\uC728\uC740 \uBC18\uB4DC\uC2DC \uC785\uB825\uD574\uC57C \uD569\uB2C8\uB2E4.</span>
        </div>
        <div class="agency-form-grid">
          <label>\uB300\uB9AC\uC810\uBA85 <em>\uD544\uC218</em><input class="quantity-input" name="name" placeholder="\uC608: \uBD80\uC0B0 \uBDF0\uD2F0 \uB300\uB9AC\uC810" required /></label>
          <label>\uB300\uB9AC\uC810 \uCF54\uB4DC <em>\uD544\uC218</em><input class="quantity-input" name="code" placeholder="\uC608: BUSANBEAUTY" required /></label>
          <label>\uC804\uC6A9 \uB9C1\uD06C <em>\uD544\uC218</em><input class="quantity-input" name="linkSlug" placeholder="\uC608: busan-beauty" required /></label>
          <label>\uC601\uC5C5\uBE44\uC728 <em>\uD544\uC218</em><input class="quantity-input" name="commissionRate" type="number" min="0" max="100" value="10" required /></label>
        </div>
      </section>
      <section class="agency-form-section">
        <div class="product-form-group-head">
          <strong>\uC6B4\uC601 \uC815\uBCF4</strong>
          <span>\uACC4\uC57D \uAE30\uAC04, \uB2F4\uB2F9\uC790, \uC815\uC0B0 \uACC4\uC88C\uB294 \uB0B4\uBD80 \uAD00\uB9AC\uC6A9\uC785\uB2C8\uB2E4.</span>
        </div>
        <div class="agency-form-grid">
          <label>\uC0C1\uD0DC
            <select class="option-select" name="status">
              <option value="active">active</option>
              <option value="paused">paused</option>
              <option value="terminated">terminated</option>
            </select>
          </label>
          <label>\uACC4\uC57D \uC2DC\uC791\uC77C<input class="quantity-input" name="contractStart" type="date" /></label>
          <label>\uACC4\uC57D \uC885\uB8CC\uC77C<input class="quantity-input" name="contractEnd" type="date" /></label>
          <label>\uB2F4\uB2F9\uC790<input class="quantity-input" name="managerName" placeholder="\uBCF8\uC0AC \uB2F4\uB2F9\uC790" /></label>
          <label>\uB2F4\uB2F9 \uC5F0\uB77D\uCC98<input class="quantity-input" name="managerPhone" placeholder="010-0000-0000" /></label>
          <label class="profile-wide">\uC815\uC0B0 \uACC4\uC88C<input class="quantity-input" name="settlementAccount" placeholder="\uC740\uD589 / \uACC4\uC88C\uBC88\uD638 / \uC608\uAE08\uC8FC" /></label>
        </div>
      </section>
      <section class="agency-form-section">
        <div class="product-form-group-head">
          <strong>\uB300\uB9AC\uC810 \uB85C\uADF8\uC778 \uACC4\uC815</strong>
          <span>\uD574\uB2F9 \uB300\uB9AC\uC810\uC774 Agency \uD654\uBA74\uC5D0 \uC811\uC18D\uD560 \uC544\uC774\uB514\uC640 \uBE44\uBC00\uBC88\uD638</span>
        </div>
        <div class="agency-form-grid">
          <label>\uB85C\uADF8\uC778 \uC544\uC774\uB514<input class="quantity-input" name="loginUserId" placeholder="\uC608: gangnam01" /></label>
          <label>\uCD08\uAE30/\uBCC0\uACBD \uBE44\uBC00\uBC88\uD638<input class="quantity-input" name="loginPassword" type="password" placeholder="\uC785\uB825 \uC2DC \uBE44\uBC00\uBC88\uD638 \uBCC0\uACBD" /></label>
          <label class="profile-wide">\uC548\uB0B4
            <input class="quantity-input" readonly value="\uBE44\uBC00\uBC88\uD638\uB294 \uC800\uC7A5 \uC2DC \uD574\uC2DC\uB85C \uBCF4\uAD00\uB418\uBA70, \uC218\uC815 \uC2DC \uBE44\uC6CC\uB450\uBA74 \uAE30\uC874 \uBE44\uBC00\uBC88\uD638\uB97C \uC720\uC9C0\uD569\uB2C8\uB2E4." />
          </label>
        </div>
      </section>
      <div class="agency-form-actions">
        <button class="buy-button" type="button" data-agency-submit>\uB300\uB9AC\uC810 \uB4F1\uB85D</button>
        <button class="cart-button" type="button" data-agency-reset>\uC785\uB825 \uCD08\uAE30\uD654</button>
      </div>
    </div>
  `;
  }
  function createAgencyManageRow(agency, store) {
    const metrics = getAgencyAdminMetrics(agency, store);
    const controls = agency.isHeadquarters
      ? "<strong>\uAE30\uBCF8\uAC12</strong>"
      : `
      <button class="cart-button mini-button" type="button" data-agency-edit="${agency.id}">\uC218\uC815</button>
      <button class="cart-button mini-button" type="button" data-agency-delete="${agency.id}">\uC0AD\uC81C</button>
    `;
    return `
    <article class="agency-table-row">
      <div>
        <button class="member-detail-button agency-name-button" type="button" data-agency-admin-detail="${agency.id}">${agency.name}</button>
        <span>${agency.isHeadquarters ? "\uBCF8\uC0AC" : "\uACC4\uC57D"} \xB7 ${agency.managerName || "\uB2F4\uB2F9 \uBBF8\uB4F1\uB85D"}</span>
      </div>
      <div>${formatMoney(metrics.monthSales)}</div>
      <div>${formatMoney(metrics.monthCommission)}</div>
      <div>${metrics.memberCount.toLocaleString("ko-KR")}\uBA85<span>\uAD6C\uB9E4 ${metrics.buyerCount}\uBA85</span></div>
      <div>${agency.status}<span>${agency.commissionRate}% \xB7 ${agency.loginUserId ? "\uB85C\uADF8\uC778 \uB4F1\uB85D" : "\uB85C\uADF8\uC778 \uBBF8\uB4F1\uB85D"}</span></div>
      <div class="agency-row-actions">${controls}</div>
    </article>
  `;
  }
  function getAgencyAdminMetrics(agency, store) {
    const members = store.members.filter(
      (member) => member.agencyId === agency.id,
    );
    const memberIds = new Set(members.map((member) => member.id));
    const orders = store.orders
      .filter((order) => order.agencyIdAtOrder === agency.id)
      .sort((a, b) => String(b.paidAt).localeCompare(a.paidAt));
    const monthOrders = orders.filter(
      (order) => order.status === "paid" && isCurrentMonthDate(order.paidAt),
    );
    const settlements = store.agencySettlementLedger
      .filter((item) => item.agencyId === agency.id)
      .sort((a, b) => String(b.createdAt).localeCompare(a.createdAt));
    const monthSettlements = settlements.filter((item) =>
      isCurrentMonthDate(item.createdAt),
    );
    const buyers = new Set(orders.map((order) => order.memberId));
    return {
      buyerCount: [...buyers].filter((memberId) => memberIds.has(memberId))
        .length,
      memberCount: members.length,
      monthCommission: monthSettlements.reduce(
        (sum, item) => sum + Number(item.commissionAmount || 0),
        0,
      ),
      monthSales: monthOrders.reduce(
        (sum, order) => sum + Number(order.paidProductAmount || 0),
        0,
      ),
      orders,
      pendingCommission: settlements
        .filter((item) => item.status !== "paid")
        .reduce((sum, item) => sum + Number(item.commissionAmount || 0), 0),
      settlements,
      totalCommission: settlements.reduce(
        (sum, item) => sum + Number(item.commissionAmount || 0),
        0,
      ),
      totalSales: orders.reduce(
        (sum, order) => sum + Number(order.paidProductAmount || 0),
        0,
      ),
    };
  }
  function createProductManagementWorkspace(store) {
    const products2 = (store.products || []).filter(
      (product) => product.status !== "deleted",
    );
    const categoryCounts = getProductCategoryCounts(products2);
    const displayedCount = products2.filter(
      (product) => product.displayStatus === "displayed",
    ).length;
    const hiddenCount = products2.filter(
      (product) => product.displayStatus === "hidden",
    ).length;
    const activeCount = products2.filter(
      (product) =>
        product.status === "selling" && product.displayStatus === "displayed",
    ).length;
    const lowStockCount = products2.filter(
      (product) =>
        Number(product.stock || 0) <= Number(product.safetyStock || 0),
    ).length;
    return `
    <section class="product-management-shell">
      <aside class="product-list-panel" aria-label="\uC0C1\uD488 \uBAA9\uB85D">
        <div class="product-list-summary">
          <article><span>\uC804\uCCB4 \uC0C1\uD488</span><strong>${products2.length}</strong></article>
          <article><span>\uD310\uB9E4\uC911</span><strong>${activeCount}</strong></article>
          <article><span>\uB178\uCD9C \uC0C1\uD488</span><strong>${displayedCount}</strong></article>
          <article><span>\uC228\uAE40 \uC0C1\uD488</span><strong>${hiddenCount}</strong></article>
          <article><span>\uC7AC\uACE0\uC8FC\uC758</span><strong>${lowStockCount}</strong></article>
        </div>
        <div class="product-list-tools">
          <div>
            <strong>\uC0C1\uD488 \uBAA9\uB85D</strong>
            <span>\uC0C1\uD488\uBA85\uC744 \uC120\uD0DD\uD558\uBA74 \uC624\uB978\uCABD \uD3B8\uC9D1 \uD328\uB110\uC5D0 \uBD88\uB7EC\uC635\uB2C8\uB2E4.</span>
          </div>
        </div>
        <div class="product-list-controls" aria-label="\uC0C1\uD488 \uBAA9\uB85D \uAC80\uC0C9\uACFC \uC815\uB82C">
          <label>\uAC80\uC0C9
            <input class="quantity-input" type="search" placeholder="\uC0C1\uD488\uBA85, SKU, \uD0A4\uC6CC\uB4DC" data-product-list-search />
          </label>
          <label>\uC0C1\uD0DC
            <select class="option-select" data-product-status-filter>
              <option value="all">\uC804\uCCB4 \uC0C1\uD0DC</option>
              <option value="selling">\uD310\uB9E4\uC911</option>
              <option value="soldout">\uD488\uC808</option>
              <option value="stopped">\uD310\uB9E4\uC911\uC9C0</option>
              <option value="hidden">\uC228\uAE40</option>
              <option value="low-stock">\uC7AC\uACE0\uC8FC\uC758</option>
            </select>
          </label>
          <label>\uC815\uB82C
            <select class="option-select" data-product-sort>
              <option value="default">\uAE30\uBCF8\uC21C</option>
              <option value="name">\uC0C1\uD488\uBA85\uC21C</option>
              <option value="sale-desc">\uD310\uB9E4\uAC00 \uB192\uC740\uC21C</option>
              <option value="sale-asc">\uD310\uB9E4\uAC00 \uB0AE\uC740\uC21C</option>
              <option value="stock-asc">\uC7AC\uACE0 \uC801\uC740\uC21C</option>
              <option value="hidden-first">\uC228\uAE40 \uBA3C\uC800</option>
            </select>
          </label>
        </div>
        <div class="product-category-filters" aria-label="\uC0C1\uD488 \uCE74\uD14C\uACE0\uB9AC \uD544\uD130">
          ${createProductCategoryFilter("all", "\uC804\uCCB4", products2.length, true)}
          ${createProductCategoryFilter("\uBBF8\uC6A9\uAE30\uAD6C", "\uBBF8\uC6A9\uAE30\uAD6C", categoryCounts["\uBBF8\uC6A9\uAE30\uAD6C"] || 0)}
          ${createProductCategoryFilter("\uBBF8\uC6A9\uC7AC\uB8CC", "\uBBF8\uC6A9\uC7AC\uB8CC", categoryCounts["\uBBF8\uC6A9\uC7AC\uB8CC"] || 0)}
          ${createProductCategoryFilter("\uD654\uC7A5\uD488", "\uD654\uC7A5\uD488", categoryCounts["\uD654\uC7A5\uD488"] || 0)}
        </div>
        <div class="product-card-list" data-product-card-list>
          ${products2.map(createProductManageRow).join("")}
        </div>
      </aside>
      <section class="product-editor-panel">
        <div class="product-editor-title">
          <div>
            <strong>\uC0C1\uD488 \uD3B8\uC9D1</strong>
            <span>\uD544\uC218 \uD56D\uBAA9\uBD80\uD130 \uC800\uC7A5\uD558\uACE0, \uC6B4\uC601 \uC138\uBD80 \uC815\uBCF4\uB294 \uADF8\uB8F9\uBCC4\uB85C \uBCF4\uC644\uD569\uB2C8\uB2E4.</span>
          </div>
          <span class="product-editor-badge">Admin only</span>
        </div>
        ${createProductAdminForm()}
      </section>
    </section>
  `;
  }
  function getProductCategoryCounts(products2) {
    return products2.reduce((counts, product) => {
      counts[product.category] = (counts[product.category] || 0) + 1;
      return counts;
    }, {});
  }
  function createProductCategoryFilter(
    category,
    label,
    count,
    isActive = false,
  ) {
    return `
    <button class="product-category-filter ${isActive ? "is-active" : ""}" type="button" data-product-category-filter="${category}">
      <span>${label}</span>
      <strong>${count}</strong>
    </button>
  `;
  }
  function createVariantEditorRow(variant = {}) {
    return `
    <label>\uC635\uC158\uBA85
      <input class="quantity-input" data-variant-option value="${escapeAttribute(variant.optionName || "")}" placeholder="50ml / Rose" />
    </label>
    <label>SKU
      <input class="quantity-input" data-variant-sku value="${escapeAttribute(variant.sku || "")}" placeholder="COS-SUN-STD" />
    </label>
    <label>\uC7AC\uACE0
      <input class="quantity-input" data-variant-stock type="number" min="0" value="${Number(variant.stock || 0)}" />
    </label>
    <label>\uCD94\uAC00\uAE08\uC561
      <input class="quantity-input" data-variant-price-delta type="number" value="${Number(variant.priceDelta || 0)}" />
    </label>
    <label>\uC0C1\uD0DC
      <select class="option-select" data-variant-status>
        <option value="selling" ${variant.status === "selling" ? "selected" : ""}>\uD310\uB9E4\uC911</option>
        <option value="soldout" ${variant.status === "soldout" ? "selected" : ""}>\uD488\uC808</option>
        <option value="stopped" ${variant.status === "stopped" ? "selected" : ""}>\uD310\uB9E4\uC911\uC9C0</option>
      </select>
    </label>
    <button class="cart-button mini-button" type="button" data-variant-remove>\uC0AD\uC81C</button>
  `;
  }
  function createProductAdminForm() {
    return `
    <div class="agency-admin-form product-admin-form" data-product-form>
      <input type="hidden" name="productId" />
      <section class="product-form-group product-required-group">
        <div class="product-form-group-head">
          <strong>\uD544\uC218 \uB4F1\uB85D \uC815\uBCF4</strong>
          <span>\uC0C1\uD488 \uD310\uB9E4\uB97C \uC2DC\uC791\uD558\uAE30 \uC704\uD55C \uCD5C\uC18C \uC785\uB825\uAC12</span>
        </div>
        <div class="required-form-note">
          <strong>\uD544\uC218</strong>
          <span>\uD55C\uAE00 \uC0C1\uD488\uBA85\uACFC \uD310\uB9E4\uAC00\uB294 \uBC18\uB4DC\uC2DC \uC785\uB825\uD574\uC57C \uD569\uB2C8\uB2E4. \uD310\uB9E4\uC911 \uC0C1\uD488\uC740 \uC7AC\uACE0\uAC00 1\uAC1C \uC774\uC0C1\uC774\uC5B4\uC57C \uAD6C\uB9E4 \uAC00\uB2A5\uD569\uB2C8\uB2E4.</span>
        </div>
        <div class="product-form-grid product-required-grid">
          <label>\uC0C1\uD488\uBA85 \uD55C\uAE00 <em>\uD544\uC218</em><input class="quantity-input" name="ko" placeholder="\uB370\uC77C\uB9AC \uD1A4\uC5C5 \uC120\uC2A4\uD06C\uB9B0" required /></label>
          <label>\uD310\uB9E4\uAC00 <em>\uD544\uC218</em><input class="quantity-input" name="sale" type="number" min="0" required /></label>
          <label>\uC7AC\uACE0 <em>\uD310\uB9E4\uC911 \uD544\uC218</em><input class="quantity-input" name="stock" type="number" min="0" /></label>
          <label>\uCE74\uD14C\uACE0\uB9AC
            <select class="option-select" name="category">
              <option value="\uBBF8\uC6A9\uAE30\uAD6C">\uBBF8\uC6A9\uAE30\uAD6C</option>
              <option value="\uBBF8\uC6A9\uC7AC\uB8CC">\uBBF8\uC6A9\uC7AC\uB8CC</option>
              <option value="\uD654\uC7A5\uD488" selected>\uD654\uC7A5\uD488</option>
            </select>
          </label>
        </div>
      </section>
      <section class="product-form-group">
        <div class="product-form-group-head">
          <strong>\uAE30\uBCF8 \uC815\uBCF4</strong>
          <span>\uC790\uB3D9 \uC0DD\uC131 \uAC00\uB2A5\uD55C \uC0C1\uD488 \uCF54\uB4DC\uC640 \uC1FC\uD551\uBAB0 \uB178\uCD9C \uBCF4\uC870 \uC815\uBCF4</span>
        </div>
        <div class="product-form-grid">
          <label>\uC0C1\uD488\uBA85 \uC601\uBB38<input class="quantity-input" name="name" placeholder="Daily Tone Up Sunscreen" /></label>
          <label>\uC0C1\uD488\uCF54\uB4DC/SKU<input class="quantity-input" name="sku" placeholder="COS-SUN-001" /></label>
          <label>\uC0C1\uD488\uC720\uD615<input class="quantity-input" name="type" placeholder="Sun Care SPF" /></label>
          <label>\uBC30\uC9C0<input class="quantity-input" name="badge" placeholder="Best" /></label>
          <label class="profile-wide">\uAC80\uC0C9 \uD0A4\uC6CC\uB4DC<input class="quantity-input" name="searchKeywords" placeholder="\uC0C1\uD488\uBA85, \uD6A8\uB2A5, \uCE74\uD14C\uACE0\uB9AC" /></label>
          <label class="profile-wide">\uBAA9\uB85D \uC124\uBA85<input class="quantity-input" name="short" placeholder="\uC0C1\uD488 \uCE74\uB4DC\uC5D0 \uD45C\uC2DC\uD560 \uC9E7\uC740 \uC124\uBA85" /></label>
          <label class="profile-wide">\uC0C1\uC138 \uC124\uBA85<textarea class="quantity-input" name="desc" rows="3" placeholder="\uC0C1\uD488 \uC0C1\uC138 \uC124\uBA85"></textarea></label>
        </div>
      </section>
      <section class="product-form-group">
        <div class="product-form-group-head">
          <strong>\uC774\uBBF8\uC9C0 \uB4F1\uB85D</strong>
          <span>\uB300\uD45C \uC774\uBBF8\uC9C0\uC640 \uACB0\uC81C \uC0C1\uC138 \uC548\uB0B4 \uC774\uBBF8\uC9C0\uB97C \uB4F1\uB85D</span>
        </div>
        <div class="product-image-editor">
          <div class="product-image-preview" data-product-image-preview><span>\uC774\uBBF8\uC9C0 \uC5C6\uC74C</span></div>
          <div class="product-image-fields">
            <label>\uB300\uD45C \uC774\uBBF8\uC9C0 URL<input class="quantity-input" name="image" placeholder="https://..." /></label>
            <label>\uB85C\uCEEC \uC774\uBBF8\uC9C0 \uC120\uD0DD<input class="quantity-input" type="file" accept="image/*" data-product-image-file /></label>
            <button class="cart-button mini-button" type="button" data-product-image-sample>\uC0D8\uD50C \uC774\uBBF8\uC9C0 \uC801\uC6A9</button>
            <button class="cart-button mini-button" type="button" data-product-image-clear>\uB300\uD45C \uC774\uBBF8\uC9C0 \uC0AD\uC81C</button>
          </div>
        </div>
        <div class="product-detail-image-manager">
          <div class="product-form-group-head compact">
            <strong>\uC0C1\uC138 \uC548\uB0B4 \uC774\uBBF8\uC9C0</strong>
            <span>\uACB0\uC81C \uD398\uC774\uC9C0 \uD558\uB2E8\uC5D0 \uB178\uCD9C\uB418\uB294 \uC774\uBBF8\uC9C0, \uCD5C\uB300 5\uAC1C</span>
          </div>
          ${Array.from(
            { length: 5 },
            (_, index) => `
            <article class="product-detail-image-row">
              <div class="product-detail-image-preview" data-product-detail-image-preview="${index + 1}"><span>${index + 1}</span></div>
              <label>\uC0C1\uC138 \uC774\uBBF8\uC9C0 ${index + 1} URL
                <input class="quantity-input" name="detailImage${index + 1}" placeholder="https://..." data-product-detail-image-input="${index + 1}" />
              </label>
              <label>\uD30C\uC77C \uC120\uD0DD
                <input class="quantity-input" type="file" accept="image/*" data-product-detail-image-file="${index + 1}" />
              </label>
              <button class="cart-button mini-button" type="button" data-product-detail-image-clear="${index + 1}">\uC0AD\uC81C</button>
            </article>
          `,
          ).join("")}
        </div>
      </section>
      <section class="product-form-group">
        <div class="product-form-group-head">
          <strong>\uAC00\uACA9 / \uD310\uB9E4 / \uC7AC\uACE0</strong>
          <span>\uD310\uB9E4\uAC00, \uC6D0\uAC00, \uB9C8\uC9C4, \uD488\uC808 \uAE30\uC900</span>
        </div>
        <div class="product-form-grid">
          <label>\uC18C\uBE44\uC790\uAC00<input class="quantity-input" name="price" type="number" min="0" /></label>
          <label>\uACF5\uAE09\uAC00<input class="quantity-input" name="supplyPrice" type="number" min="0" /></label>
          <label>\uC6D0\uAC00<input class="quantity-input" name="cost" type="number" min="0" /></label>
          <label>\uC548\uC804\uC7AC\uACE0<input class="quantity-input" name="safetyStock" type="number" min="0" value="5" /></label>
          <label>\uD310\uB9E4\uC0C1\uD0DC
            <select class="option-select" name="status">
              <option value="selling">\uD310\uB9E4\uC911</option>
              <option value="soldout">\uD488\uC808</option>
              <option value="stopped">\uD310\uB9E4\uC911\uC9C0</option>
            </select>
          </label>
          <label>\uC9C4\uC5F4\uC0C1\uD0DC
            <select class="option-select" name="displayStatus">
              <option value="displayed">\uC9C4\uC5F4\uD568</option>
              <option value="hidden">\uC9C4\uC5F4\uC548\uD568</option>
            </select>
          </label>
        </div>
      </section>
      <section class="product-form-group">
        <div class="product-form-group-head">
          <strong>\uBC30\uC1A1 / \uC815\uCC45 / \uACF5\uAE09</strong>
          <span>\uBC30\uC1A1\uBE44, \uACFC\uC138, \uACF5\uAE09\uC0AC, \uC81C\uC870 \uAE30\uC900</span>
        </div>
        <div class="product-defaults-row">
          <p>\uBC18\uBCF5 \uC785\uB825\uC774 \uB9CE\uC740 \uC6B4\uC601 \uAE30\uC900\uAC12\uC740 \uC0C1\uD488\uBCC4\uB85C \uD55C \uBC88\uC5D0 \uCC44\uC6B8 \uC218 \uC788\uC2B5\uB2C8\uB2E4.</p>
          <button class="cart-button mini-button" type="button" data-product-defaults>\uC6B4\uC601 \uAE30\uBCF8\uAC12 \uC801\uC6A9</button>
        </div>
        <div class="product-form-grid">
          <label>\uBC30\uC1A1\uC815\uCC45
            <select class="option-select" name="shippingType">
              <option value="default">\uAE30\uBCF8 \uBC30\uC1A1</option>
              <option value="free">\uBB34\uB8CC \uBC30\uC1A1</option>
              <option value="conditional">\uC870\uAC74\uBD80 \uBB34\uB8CC</option>
              <option value="supplier">\uACF5\uAE09\uC0AC \uBC30\uC1A1</option>
            </select>
          </label>
          <label>\uBC30\uC1A1\uBE44<input class="quantity-input" name="shippingFee" type="number" min="0" value="3000" /></label>
          <label>\uACFC\uC138
            <select class="option-select" name="taxType">
              <option value="taxable">\uACFC\uC138</option>
              <option value="tax_free">\uBA74\uC138</option>
              <option value="zero_tax">\uC601\uC138</option>
            </select>
          </label>
          <label>\uC0C1\uD488\uBCC4 \uC801\uB9BD\uB960<input class="quantity-input" name="pointRateOverride" type="number" min="0" max="100" placeholder="\uACF5\uB780\uC774\uBA74 \uAE30\uBCF8 \uC801\uB9BD\uB960" /></label>
          <label>\uC81C\uC870\uC0AC<input class="quantity-input" name="manufacturer" placeholder="BEAUTY REF." /></label>
          <label>\uACF5\uAE09\uC0AC<input class="quantity-input" name="supplier" placeholder="\uBCF8\uC0AC \uBB3C\uB958" /></label>
          <label>\uC6D0\uC0B0\uC9C0<input class="quantity-input" name="origin" placeholder="Korea" /></label>
          <label>\uBE0C\uB79C\uB4DC<input class="quantity-input" name="brand" placeholder="BEAUTY REF." /></label>
          <label>\uBC14\uCF54\uB4DC<input class="quantity-input" name="barcode" placeholder="880..." /></label>
        </div>
      </section>
      <section class="product-form-group">
        <div class="product-form-group-head">
          <strong>\uC635\uC158 / SKU</strong>
          <span>\uC0C9\uC0C1, \uC6A9\uB7C9, \uBC1D\uAE30 \uAC19\uC740 \uD558\uC704 \uC0C1\uD488\uAD70 \uAD00\uB9AC</span>
        </div>
        <div class="product-form-grid variant-main-grid">
          <label>\uB300\uD45C \uC635\uC158<input class="quantity-input" name="option" placeholder="50ml / SPF50+ PA++++" /></label>
        </div>
        <div class="variant-editor-toolbar">
          <div>
            <strong>\uC635\uC158 SKU \uBAA9\uB85D</strong>
            <span>\uC635\uC158\uBCC4 \uC7AC\uACE0, \uCD94\uAC00\uAE08\uC561, \uD310\uB9E4\uC0C1\uD0DC\uB97C \uAC1C\uBCC4 \uAD00\uB9AC\uD569\uB2C8\uB2E4.</span>
          </div>
          <button class="cart-button mini-button variant-add-button" type="button" data-variant-add>\uC635\uC158 \uCD94\uAC00</button>
        </div>
        <div class="variant-editor" data-variant-editor aria-label="\uC635\uC158 SKU \uBAA9\uB85D"></div>
        <label class="profile-wide variant-raw-field" hidden>\uC635\uC158 SKU \uC6D0\uBCF8
          <textarea class="quantity-input" name="variants" rows="4" placeholder="\uC635\uC158\uBA85 | SKU | \uC7AC\uACE0 | \uCD94\uAC00\uAE08\uC561 | \uC0C1\uD0DC" hidden></textarea>
        </label>
      </section>
      <div class="agency-form-actions">
        <button class="buy-button" type="button" data-product-submit>\uC0C1\uD488 \uB4F1\uB85D</button>
        <button class="cart-button" type="button" data-product-reset>\uC785\uB825 \uCD08\uAE30\uD654</button>
      </div>
      <p class="product-form-message" data-product-form-message aria-live="polite"></p>
    </div>
  `;
  }
  function createProductManageRow(product) {
    const margin = product.sale - (product.supplyPrice || product.cost || 0);
    const stockWarning =
      Number(product.stock || 0) <= Number(product.safetyStock || 0)
        ? " \xB7 \uC548\uC804\uC7AC\uACE0 \uC774\uD558"
        : "";
    const image = product.image
      ? `<img src="${escapeAttribute(product.image)}" alt="${escapeAttribute(product.ko)}" />`
      : `<span>${product.category}</span>`;
    const isHidden = product.displayStatus === "hidden";
    const visibilityLabel = isHidden ? "\uB178\uCD9C" : "\uC228\uAE40";
    return `
    <article class="product-list-card ${isHidden ? "is-hidden-product" : ""}" data-product-category-card="${product.category}" data-product-search="${escapeAttribute(`${product.name} ${product.ko} ${product.sku || ""} ${product.id} ${product.searchKeywords || ""}`.toLowerCase())}" data-product-status="${product.status}" data-product-display="${product.displayStatus}" data-product-stock="${Number(product.stock || 0)}" data-product-safety-stock="${Number(product.safetyStock || 0)}" data-product-sale="${Number(product.sale || 0)}" data-product-name="${escapeAttribute(product.ko || product.name)}">
      <div class="product-list-thumb">${image}</div>
      <div class="product-list-main">
        <div class="product-list-title">
          <strong>${product.ko}</strong>
          <span>${product.name}</span>
        </div>
        <div class="product-list-meta">
          <span>${product.category}</span>
          <span>${product.sku || product.id}</span>
          <span>${product.displayStatus} / ${product.status}</span>
        </div>
        <div class="product-list-stats">
          <span>\uD310\uB9E4\uAC00 <strong>${formatMoney(product.sale)}</strong></span>
          <span>\uB9C8\uC9C4 <strong>${formatMoney(margin)}</strong></span>
          <span>\uC7AC\uACE0 <strong>${product.stock || 0}\uAC1C${stockWarning}</strong></span>
        </div>
      </div>
      <div class="product-list-actions">
        <button class="cart-button mini-button" type="button" data-product-edit="${product.id}">\uD3B8\uC9D1</button>
        <button class="cart-button mini-button" type="button" data-product-visibility="${product.id}">${visibilityLabel}</button>
      </div>
    </article>
  `;
  }
  function createAgencyIdentifiers(name) {
    const romanized = romanizeText(name)
      .split(/\s+/)
      .filter(Boolean)
      .filter((token) => !["daerijeom", "agency"].includes(token));
    const baseTokens = romanized.length ? romanized.slice(0, 2) : ["agency"];
    const slug = baseTokens.join("-").replace(/-+/g, "-");
    return {
      code: slug.replace(/-/g, "").toUpperCase(),
      linkSlug: slug.toLowerCase(),
    };
  }
  function hashManagementPassword(userId, password) {
    const source = `${String(userId || "")
      .trim()
      .toLowerCase()}:${password}:beauty-ref-demo-v1`;
    let hash = 2166136261;
    for (let index = 0; index < source.length; index += 1) {
      hash ^= source.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0).toString(16).padStart(8, "0");
  }
  function romanizeText(value) {
    return value
      .trim()
      .toLowerCase()
      .split("")
      .map(romanizeCharacter)
      .join("")
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  }
  function romanizeCharacter(character) {
    const code = character.charCodeAt(0);
    if (code < 44032 || code > 55203) return character;
    const initial = [
      "g",
      "kk",
      "n",
      "d",
      "tt",
      "r",
      "m",
      "b",
      "pp",
      "s",
      "ss",
      "",
      "j",
      "jj",
      "ch",
      "k",
      "t",
      "p",
      "h",
    ];
    const medial = [
      "a",
      "ae",
      "ya",
      "yae",
      "eo",
      "e",
      "yeo",
      "ye",
      "o",
      "wa",
      "wae",
      "oe",
      "yo",
      "u",
      "wo",
      "we",
      "wi",
      "yu",
      "eu",
      "ui",
      "i",
    ];
    const final = [
      "",
      "k",
      "k",
      "ks",
      "n",
      "nj",
      "nh",
      "t",
      "l",
      "lk",
      "lm",
      "lb",
      "ls",
      "lt",
      "lp",
      "lh",
      "m",
      "p",
      "ps",
      "t",
      "t",
      "ng",
      "t",
      "t",
      "k",
      "t",
      "p",
      "h",
    ];
    const index = code - 44032;
    const initialIndex = Math.floor(index / 588);
    const medialIndex = Math.floor((index % 588) / 28);
    const finalIndex = index % 28;
    return `${initial[initialIndex]}${medial[medialIndex]}${final[finalIndex]}`;
  }
  function createMemberDashboard(store) {
    var _a;
    const member =
      store.members.find((item) => item.id === store.currentMemberId) ||
      store.members[0];
    const memberOrders = store.orders.filter(
      (order) => order.memberId === member.id,
    );
    const links = store.personalReferralLinks.filter(
      (link) => link.ownerMemberId === member.id,
    );
    const points = store.pointLedger.filter(
      (item) => item.memberId === member.id,
    );
    return `
    <section class="management-dashboard">
      <div class="management-head">
        <div>
          <div class="product-category">Member / My page</div>
          <h1 class="detail-title">My Beauty.</h1>
        </div>
        <p>\uD68C\uC6D0\uC5D0\uAC8C\uB294 \uB300\uB9AC\uC810 \uC18C\uC18D\uC744 \uB178\uCD9C\uD558\uC9C0 \uC54A\uACE0 \uD3EC\uC778\uD2B8, \uC8FC\uBB38, \uC0C1\uD488\uBCC4 \uCD94\uCC9C\uB9C1\uD06C\uB9CC \uBCF4\uC5EC\uC90D\uB2C8\uB2E4.</p>
      </div>
      <div class="management-grid">
        <article><span>\uBCF4\uC720 \uD3EC\uC778\uD2B8</span><strong>${member.points.toLocaleString("ko-KR")}P</strong></article>
        <article><span>\uC8FC\uBB38 \uC218</span><strong>${memberOrders.length}\uAC74</strong></article>
        <article><span>\uCD94\uCC9C \uB9C1\uD06C</span><strong>${links.length}\uAC1C</strong></article>
        <article><span>\uB300\uD45C \uB9C1\uD06C</span><strong>${((_a = links[0]) == null ? void 0 : _a.code) || "-"}</strong></article>
        <article><span>\uACE0\uAC1D \uC0C1\uD0DC</span><strong>${member.status}</strong></article>
      </div>
      <section class="management-panel">
        <div class="product-category">Point history</div>
        <div class="process-list">
          ${points
            .slice(0, 4)
            .map(
              (point) => `
              <article class="process-row">
                <div><strong>${point.orderId}</strong><span>${point.note}</span></div>
                <div><span>\uAE30\uC900 \uAE08\uC561</span><strong>${formatMoney(point.baseAmount)}</strong></div>
                <div><span>\uC801\uB9BD\uB960</span><strong>${point.rate}%</strong></div>
                <div><span>\uC801\uB9BD</span><strong>${point.amount.toLocaleString("ko-KR")}P</strong></div>
              </article>
            `,
            )
            .join("")}
        </div>
      </section>
    </section>
  `;
  }

  // scripts/domain/order-processing.js
  function completeBypassPayment({ cart, store, payment }) {
    var _a;
    const member = store.members.find((item) => item.id === payment.memberId);
    if (!member) {
      throw new Error(
        "\uACB0\uC81C \uCC98\uB9AC \uB300\uC0C1 \uD68C\uC6D0\uC744 \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.",
      );
    }
    const paidProductAmount = cart.reduce(
      (sum, item) => sum + item.sale * item.qty,
      0,
    );
    const shippingAmount =
      paidProductAmount > 0 && paidProductAmount < 5e4 ? 3e3 : 0;
    const pointUseLimit = calculatePointUseLimit({
      paidProductAmount,
      memberPoints: member.points,
      maxPointUseRate: store.settings.maxPointUseRate,
    });
    const pointUsed = normalizePointUsed(payment.pointUsed, pointUseLimit);
    const paidAmount = paidProductAmount + shippingAmount - pointUsed;
    const pointRate = store.settings.purchasePointRate;
    const earnedPoints = calculatePurchasePoints(paidProductAmount, pointRate);
    const orderId = createId("order", store.orders.length + 1);
    const paidAt = /* @__PURE__ */ new Date().toISOString().slice(0, 10);
    const agencyIdAtOrder =
      member.agencyId ||
      ((_a = getHeadquartersAgency(store)) == null ? void 0 : _a.id);
    const referralSourceType = payment.referralSourceType || "none";
    const shippingSnapshot = normalizeShippingSnapshot(
      payment.shippingSnapshot,
      member,
    );
    const order = {
      id: orderId,
      memberId: member.id,
      agencyIdAtOrder,
      referralSourceType,
      paidProductAmount,
      shippingAmount,
      paidAmount,
      pointUsed,
      pointUseLimit,
      pointEarned: earnedPoints,
      status: "paid",
      shippingStatus: "preparing",
      courier: "",
      trackingNumber: "",
      shippedAt: "",
      deliveredAt: "",
      shippingMemo: "",
      shippingAddress: shippingSnapshot,
      paymentMethod: shippingSnapshot.paymentMethod || "",
      paidAt,
      items: cart.map((item) => ({
        productId: item.id,
        productName: item.name,
        productKo: item.ko,
        sale: item.sale,
        qty: item.qty,
        option: item.option,
        variantSku: item.variantSku || "",
      })),
    };
    store.orders.unshift(order);
    decrementProductStock(store, cart);
    member.points = Math.max(0, Number(member.points || 0) - pointUsed);
    if (pointUsed > 0) {
      store.pointLedger.unshift({
        id: createId("point", store.pointLedger.length + 1),
        memberId: member.id,
        orderId,
        type: "purchase_use",
        amount: -pointUsed,
        baseAmount: paidProductAmount,
        rate: store.settings.maxPointUseRate,
        note: "\uACB0\uC81C \uC2DC \uBCF4\uC720 \uD3EC\uC778\uD2B8 \uC0AC\uC6A9",
        createdAt: paidAt,
      });
    }
    member.points += earnedPoints;
    store.pointLedger.unshift({
      id: createId("point", store.pointLedger.length + 1),
      memberId: member.id,
      orderId,
      type: "purchase_earn",
      amount: earnedPoints,
      baseAmount: paidProductAmount,
      rate: pointRate,
      note: "\uBC30\uC1A1\uBE44 \uC81C\uC678 \uC2E4\uACB0\uC81C \uC0C1\uD488\uAE08\uC561 \uAE30\uC900 \uAD6C\uB9E4 \uC801\uB9BD",
      createdAt: paidAt,
    });
    const referralLinks = createPurchasedProductReferralLinks({
      cart,
      memberId: member.id,
      orderId,
      store,
    });
    store.personalReferralLinks.unshift(...referralLinks);
    const agencyProcessing = createAgencyProcessing({ order, store });
    if (agencyProcessing) {
      store.agencySettlementLedger.unshift(agencyProcessing);
    }
    return {
      order,
      member,
      earnedPoints,
      referralLinks,
      agencyProcessing,
      totals: {
        paidProductAmount,
        shippingAmount,
        paidAmount,
        pointUsed,
        pointUseLimit,
      },
    };
  }
  function normalizeShippingSnapshot(snapshot = {}, member = {}) {
    const fallback = member.address || {};
    return {
      recipient: snapshot.recipient || member.name || "",
      phone: snapshot.phone || member.phone || "",
      postcode: snapshot.postcode || fallback.postcode || "",
      address: snapshot.address || fallback.address || "",
      addressDetail: snapshot.addressDetail || fallback.addressDetail || "",
      paymentMethod: snapshot.paymentMethod || member.paymentMethod || "",
    };
  }
  function decrementProductStock(store, cart) {
    cart.forEach((item) => {
      var _a;
      const product = (store.products || []).find(
        (productItem) => productItem.id === item.id,
      );
      if (!product) return;
      product.stock = Math.max(0, Number(product.stock || 0) - item.qty);
      const variant =
        (product.variants || []).find(
          (variantItem) =>
            variantItem.sku === item.variantSku ||
            variantItem.optionName === item.option,
        ) || ((_a = product.variants) == null ? void 0 : _a[0]);
      if (variant) {
        variant.stock = Math.max(0, Number(variant.stock || 0) - item.qty);
      }
      if (product.stock <= 0) product.status = "soldout";
    });
  }
  function createPurchasedProductReferralLinks({
    cart,
    memberId,
    orderId,
    store,
  }) {
    const links = [];
    const nextNumber = store.personalReferralLinks.length + 1;
    const uniqueProducts = /* @__PURE__ */ new Map();
    cart.forEach((item) => {
      if (!uniqueProducts.has(item.id)) uniqueProducts.set(item.id, item);
    });
    uniqueProducts.forEach((item) => {
      const sequence = nextNumber + links.length;
      links.push({
        id: createId("ref", sequence),
        ownerMemberId: memberId,
        productId: item.id,
        orderId,
        unitIndex: 1,
        code: `${item.id.toUpperCase().replace(/[^A-Z0-9]/g, "-")}-${sequence.toString().padStart(3, "0")}`,
        status: "active",
      });
    });
    return links;
  }
  function createAgencyProcessing({ order, store }) {
    if (order.referralSourceType === "personal_product") return null;
    const agency = store.agencies.find(
      (item) => item.id === order.agencyIdAtOrder,
    );
    if (!agency) return null;
    const commissionAmount = Math.floor(
      (order.paidProductAmount * agency.commissionRate) / 100,
    );
    return {
      id: createId(
        "agency-settlement",
        store.agencySettlementLedger.length + 1,
      ),
      agencyId: agency.id,
      orderId: order.id,
      baseAmount: order.paidProductAmount,
      commissionRate: agency.commissionRate,
      commissionAmount,
      status: "pending_next_month_15",
      updatedAt: "",
      statusUpdatedBy: "",
      statusNote: "",
      statusHistory: [],
      note: "\uAC1C\uC778 \uCD94\uCC9C\uB9C1\uD06C \uAD6C\uB9E4\uAC00 \uC544\uB2C8\uBBC0\uB85C \uB300\uB9AC\uC810 \uC804\uC6D4 \uB9E4\uCD9C \uC815\uC0B0 \uB300\uC0C1",
      createdAt: order.paidAt,
    };
  }
  function getHeadquartersAgency(store) {
    return store.agencies.find((agency) => agency.isHeadquarters);
  }
  function calculatePurchasePoints(amount, rate) {
    return Math.floor(
      (Math.max(0, Number(amount) || 0) * getPercent(rate)) / 100,
    );
  }
  function calculatePointUseLimit({
    paidProductAmount,
    memberPoints,
    maxPointUseRate,
  }) {
    const productLimit = Math.floor(
      (Math.max(0, Number(paidProductAmount) || 0) *
        getPercent(maxPointUseRate)) /
        100,
    );
    return Math.min(productLimit, Math.max(0, Number(memberPoints) || 0));
  }
  function normalizePointUsed(pointUsed, pointUseLimit) {
    return Math.min(
      Math.max(0, Math.floor(Number(pointUsed) || 0)),
      Math.max(0, Number(pointUseLimit) || 0),
    );
  }
  function getPercent(value) {
    return Math.min(100, Math.max(0, Number(value) || 0));
  }
  function createId(prefix, sequence) {
    return `${prefix}-${sequence.toString().padStart(3, "0")}`;
  }

  // scripts/ui/shop.js
  function createShopController({
    dom,
    store,
    persistStore,
    requireLogin = () => true,
  }) {
    const ADDRESS_LOOKUP_PRESETS = [
      {
        label: "\uAE30\uBCF8 \uBC30\uC1A1\uC9C0",
        postcode: "06236",
        address:
          "\uC11C\uC6B8\uC2DC \uAC15\uB0A8\uAD6C \uD14C\uD5E4\uB780\uB85C 000",
      },
      {
        label: "\uC131\uC218 \uBB3C\uB958\uC13C\uD130",
        postcode: "04783",
        address:
          "\uC11C\uC6B8\uC2DC \uC131\uB3D9\uAD6C \uC5F0\uBB34\uC7A5\uAE38 00",
      },
      {
        label: "\uB9C8\uD3EC \uC0AC\uBB34\uC2E4",
        postcode: "04157",
        address: "\uC11C\uC6B8\uC2DC \uB9C8\uD3EC\uAD6C \uC591\uD654\uB85C 00",
      },
      {
        label: "\uBD80\uC0B0 \uC13C\uD140\uC810",
        postcode: "48059",
        address:
          "\uBD80\uC0B0\uC2DC \uD574\uC6B4\uB300\uAD6C \uC13C\uD140\uC911\uC559\uB85C 00",
      },
    ];
    const state = {
      // UI-only cart state. Persisted business records are created only after Pay now.
      activeCategory: "all",
      cart: [],
      pointToUse: 0,
    };
    const getQuantity = () => {
      var _a;
      return Math.max(
        1,
        Number(
          ((_a = document.querySelector("#quantity")) == null
            ? void 0
            : _a.value) || 1,
        ),
      );
    };
    const getPurchasePointRate = () =>
      Math.max(0, Number(store.settings.purchasePointRate || 0));
    const getPurchasePoints = (amount) =>
      calculatePurchasePoints(amount, getPurchasePointRate());
    const formatPoints = (points) => `${points.toLocaleString("ko-KR")}P`;
    const getProducts = () =>
      (store.products || []).filter(
        (product) =>
          product.displayStatus !== "hidden" && product.status !== "deleted",
      );
    const getProduct = (id) =>
      getProducts().find((product) => product.id === id) ||
      (store.products || []).find((product) => product.id === id);
    function getTotals() {
      const subtotal = state.cart.reduce(
        (sum, item) => sum + item.sale * item.qty,
        0,
      );
      const shipping = subtotal > 0 && subtotal < 5e4 ? 3e3 : 0;
      const member = getCurrentMember2();
      const pointUseLimit = calculatePointUseLimit({
        paidProductAmount: subtotal,
        memberPoints: (member == null ? void 0 : member.points) || 0,
        maxPointUseRate: store.settings.maxPointUseRate,
      });
      const pointUsed = Math.min(
        Math.max(0, Math.floor(Number(state.pointToUse) || 0)),
        pointUseLimit,
      );
      state.pointToUse = pointUsed;
      return {
        subtotal,
        shipping,
        reward: getPurchasePoints(subtotal),
        pointBalance: (member == null ? void 0 : member.points) || 0,
        pointUseLimit,
        pointUsed,
        total: subtotal + shipping - pointUsed,
        count: state.cart.reduce((sum, item) => sum + item.qty, 0),
      };
    }
    function getCurrentMember2() {
      return store.members.find(
        (member) => member.id === store.currentMemberId,
      );
    }
    function renderProducts(category = "all") {
      state.activeCategory = category;
      document.querySelectorAll(".category-btn").forEach((button) => {
        button.classList.toggle(
          "is-active",
          button.dataset.category === category,
        );
      });
      const visibleProducts = getProducts();
      const list =
        category === "all"
          ? visibleProducts
          : visibleProducts.filter((product) => product.category === category);
      dom.count.textContent =
        category === "all"
          ? `All products \xB7 ${list.length} items`
          : `${category} \xB7 ${list.length} items`;
      dom.grid.innerHTML = list.map(createProductCard).join("");
    }
    function createProductCard(product) {
      return `
    <article class="product-card" tabindex="0" data-id="${product.id}">
      <div class="image-wrap">
        <div class="badge">${product.badge}</div>
        <img src="${product.image}" alt="${product.ko}" />
      </div>
      <div class="product-info">
        <h3 class="product-name">${product.name}<br />\u3163${product.ko}</h3>
        <p class="price-row"><strong>\uBD84\uB958 :</strong> ${product.category}</p>
        <p class="price-row"><strong>\uD0C0\uC785 :</strong> ${product.type}</p>
        <p class="price-row"><strong>\uD310\uB9E4\uAC00 :</strong> ${formatMoney(product.price)}</p>
        <p class="price-row sale"><strong>\uD560\uC778\uD310\uB9E4\uAC00 :</strong> ${formatMoney(product.sale)}</p>
        <p class="desc">${product.short}</p>
        <div class="click-line">Buy now \u2192</div>
      </div>
    </article>
  `;
    }
    function openDetail(product) {
      if (!product) return;
      const copy =
        categoryCopy[product.category] || categoryCopy["\uD654\uC7A5\uD488"];
      dom.detail.innerHTML = `
    <div class="breadcrumb">
      <button class="back-button" id="backToShop">\u2190 Back to shop</button>
      <span>Home / Shop / ${product.ko}</span>
    </div>
    <section class="detail-layout">
      <div class="detail-gallery">
        <figure class="large"><img src="${product.image}" alt="${product.ko}" /></figure>
        <figure><img src="${product.image}" alt="${product.ko}" /></figure>
        <figure><img src="${product.image}" alt="${product.ko}" /></figure>
      </div>
      <aside class="purchase-panel">
        <div class="product-category">${product.category} / ${product.type}</div>
        <h1 class="detail-title">${product.name}</h1>
        <p class="detail-subtitle">${product.desc}</p>
        ${createPriceBox(product)}
        <div class="option-box">
          <label class="option-label" for="optionSelect">Option</label>
          ${createOptionSelect(product)}
          <div class="quantity-row">
            <div>
              <label class="option-label" for="quantity">Quantity</label>
              <input class="quantity-input" id="quantity" type="number" value="1" min="1" max="20" />
            </div>
            <div>
              <label class="option-label" for="stockStatus">Stock</label>
              <input class="quantity-input" id="stockStatus" value="${createStockLabel(product)}" readonly />
            </div>
          </div>
        </div>
        <div class="buy-actions">
          <button class="buy-button" id="buyNow">Buy now</button>
          <button class="cart-button" id="addCart">Add to cart</button>
        </div>
        <p class="detail-note">
          \uACB0\uC81C \uAE30\uB2A5\uC740 \uC0D8\uD50C UI\uC785\uB2C8\uB2E4. \uC2E4\uC81C \uC1FC\uD551\uBAB0\uC5D0\uC11C\uB294 PG \uACB0\uC81C, \uC7AC\uACE0, \uBC30\uC1A1 \uC815\uCC45,
          \uD68C\uC6D0/\uBE44\uD68C\uC6D0 \uAD6C\uB9E4 \uD50C\uB85C\uC6B0\uB97C \uC5F0\uACB0\uD558\uBA74 \uB429\uB2C8\uB2E4.
        </p>
      </aside>
    </section>
    ${createDetailContent(copy, product)}
  `;
      showDetailView();
      document.querySelector("#backToShop").addEventListener("click", showHome);
      document
        .querySelector("#addCart")
        .addEventListener("click", () => addToCart(product));
      ["input", "change"].forEach((eventName) => {
        var _a;
        (_a = document.querySelector("#optionSelect")) == null
          ? void 0
          : _a.addEventListener(eventName, () => {
              updateSelectedOptionStock(product);
            });
      });
      document.querySelector("#buyNow").addEventListener("click", () => {
        if (
          addToCart(
            product,
            "\uC0C1\uD488\uC744 \uC7A5\uBC14\uAD6C\uB2C8\uC5D0 \uB2F4\uACE0 \uC8FC\uBB38 \uC694\uC57D\uC744 \uC5F4\uC5C8\uC2B5\uB2C8\uB2E4.",
          )
        ) {
          openCart();
        }
      });
    }
    function createPriceBox(product) {
      return `
    <div class="detail-price-box">
      <div class="detail-price-item"><span>\uD310\uB9E4\uAC00</span><strong>${formatMoney(product.price)}</strong></div>
      <div class="detail-price-item"><span>\uD560\uC778\uD310\uB9E4\uAC00</span><strong>${formatMoney(product.sale)}</strong></div>
      <div class="detail-price-item"><span>\uBC30\uC1A1</span><strong>3,000\uC6D0 / 5\uB9CC\uC6D0 \uC774\uC0C1 \uBB34\uB8CC</strong></div>
      <div class="detail-price-item"><span>\uC801\uB9BD</span><strong>\uAD6C\uB9E4\uAE08\uC561 ${getPurchasePointRate()}%</strong></div>
    </div>
  `;
    }
    function createDetailContent(copy, product) {
      return `
    <section class="detail-content">
      <div class="content-block">
        <h3>Key Benefits</h3>
        <ul>${copy.benefits.map((item) => `<li>${item}</li>`).join("")}</ul>
      </div>
      <div class="content-block">
        <h3>Ingredients / Material</h3>
        <p>${copy.material}</p>
      </div>
      <div class="content-block">
        <h3>How to Use</h3>
        <p>${copy.usage}</p>
      </div>
    </section>
    <section class="review-strip" id="review">
      <div>
        <div class="review-score">4.8</div>
        <div class="small-label">Customer review</div>
      </div>
      <div class="review-copy">
        \u201C${copy.review}\u201D<br />
        \uBBF8\uB2C8\uBA40\uD55C \uC0C1\uC138 \uAD6C\uC870 \uC548\uC5D0\uC11C \uC81C\uD488 \uD6A8\uB2A5, \uC0AC\uC6A9\uBC95, \uB9AC\uBDF0, \uAD6C\uB9E4 \uBC84\uD2BC\uC744 \uD55C \uD654\uBA74\uC5D0\uC11C \uD655\uC778\uD560 \uC218 \uC788\uAC8C \uAD6C\uC131\uD588\uC2B5\uB2C8\uB2E4.
      </div>
    </section>
    ${createProductDetailImageStack(product)}
  `;
    }
    function createProductDetailImageStack(product) {
      const detailImages = getProductDetailImages(product);
      if (!detailImages.length) return "";
      return `
    <section class="product-detail-image-stack" aria-label="${product.ko} \uC0C1\uC138 \uC774\uBBF8\uC9C0">
      ${detailImages
        .map(
          (image, index) => `
          <figure>
            <img src="${image}" alt="${product.ko} \uC0C1\uC138 \uC774\uBBF8\uC9C0 ${index + 1}" />
          </figure>
        `,
        )
        .join("")}
    </section>
  `;
    }
    function addToCart(product, message) {
      if (!requireLogin()) return false;
      const quantity = getQuantity();
      const variant = getSelectedVariant(product);
      const stockLimit = getPurchasableStock(product, variant);
      const sale = getVariantSalePrice(product, variant);
      const cartKey = createCartKey(product, variant);
      if (
        product.status !== "selling" ||
        variant.status !== "selling" ||
        stockLimit <= 0
      ) {
        showToast(
          product.status !== "selling" || variant.status !== "selling"
            ? "\uD604\uC7AC \uD310\uB9E4\uC911\uC778 \uC0C1\uD488\uC774 \uC544\uB2D9\uB2C8\uB2E4."
            : "\uC7AC\uACE0\uAC00 \uC5C6\uC5B4 \uAD6C\uB9E4\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.",
        );
        return false;
      }
      const item = state.cart.find((cartItem) => cartItem.cartKey === cartKey);
      const nextQuantity = ((item == null ? void 0 : item.qty) || 0) + quantity;
      if (nextQuantity > stockLimit) {
        showToast(
          `\uC120\uD0DD \uC635\uC158 \uC7AC\uACE0\uB294 ${stockLimit.toLocaleString("ko-KR")}\uAC1C\uAE4C\uC9C0 \uAD6C\uB9E4\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.`,
        );
        return false;
      }
      if (item) {
        item.qty += quantity;
      } else {
        state.cart.push({
          ...product,
          cartKey,
          option: variant.optionName,
          variantSku: variant.sku,
          sale,
          qty: quantity,
        });
      }
      updateCart();
      showToast(
        message ||
          `${product.ko} ${quantity}\uAC1C\uAC00 \uC7A5\uBC14\uAD6C\uB2C8\uC5D0 \uB2F4\uACBC\uC2B5\uB2C8\uB2E4.`,
      );
      return true;
    }
    function createStockLabel(product) {
      if (product.status !== "selling") return "Not selling";
      const stock = getPurchasableStock(product, getDefaultVariant(product));
      return stock > 0 ? `${stock.toLocaleString("ko-KR")}\uAC1C` : "Sold out";
    }
    function createOptionSelect(product) {
      const variants = getSellingVariants(product);
      return `
      <select class="option-select" id="optionSelect">
        ${variants
          .map(
            (variant, index) => `
            <option value="${index}" ${variant.status !== "selling" || Number(variant.stock || 0) <= 0 ? "disabled" : ""}>
              ${escapeHtml(variant.optionName)}${variant.priceDelta ? ` / +${formatMoney(variant.priceDelta)}` : ""}${variant.stock <= 0 ? " / \uD488\uC808" : ""}
            </option>
          `,
          )
          .join("")}
      </select>
    `;
    }
    function getSellingVariants(product) {
      return (product.variants || []).length
        ? product.variants
        : [
            {
              optionName: product.option || "\uAE30\uBCF8 \uC635\uC158",
              sku: product.sku || product.id,
              stock: product.stock,
              priceDelta: 0,
              status: product.status,
            },
          ];
    }
    function getDefaultVariant(product) {
      return (
        getSellingVariants(product).find(
          (variant) =>
            variant.status === "selling" && Number(variant.stock || 0) > 0,
        ) || getSellingVariants(product)[0]
      );
    }
    function getSelectedVariant(product) {
      const variants = getSellingVariants(product);
      const select = document.querySelector("#optionSelect");
      const index = Number((select == null ? void 0 : select.value) || 0);
      return variants[index] || getDefaultVariant(product);
    }
    function getVariantSalePrice(product, variant) {
      return (
        Number(product.sale || 0) +
        Number((variant == null ? void 0 : variant.priceDelta) || 0)
      );
    }
    function getPurchasableStock(product, variant) {
      const productStock = Number(product.stock || 0);
      const variantStock =
        (variant == null ? void 0 : variant.stock) === void 0
          ? productStock
          : Number(variant.stock || 0);
      return Math.max(0, Math.min(productStock, variantStock));
    }
    function createCartKey(product, variant) {
      return `${product.id}::${(variant == null ? void 0 : variant.sku) || (variant == null ? void 0 : variant.optionName) || "default"}`;
    }
    function updateSelectedOptionStock(product) {
      const stockStatus = document.querySelector("#stockStatus");
      if (!stockStatus) return;
      const variant = getSelectedVariant(product);
      if (variant.status !== "selling") {
        stockStatus.value = "Not selling";
        return;
      }
      const stock = getPurchasableStock(product, variant);
      stockStatus.value =
        stock > 0 ? `${stock.toLocaleString("ko-KR")}\uAC1C` : "Sold out";
    }
    function updateCart() {
      const totals = getTotals();
      dom.bag.textContent = totals.count;
      dom.cartList.innerHTML = state.cart.length
        ? state.cart.map(createCartItem).join("")
        : createEmptyCart();
      dom.cartSummary.innerHTML = createCartSummary(totals);
      document
        .querySelector("#checkoutButton")
        .addEventListener("click", () => {
          state.cart.length
            ? openCheckout()
            : showToast(
                "\uC7A5\uBC14\uAD6C\uB2C8\uC5D0 \uC0C1\uD488\uC744 \uBA3C\uC800 \uB2F4\uC544\uC8FC\uC138\uC694.",
              );
        });
    }
    function createCartItem(item) {
      return `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.ko}" />
      <div>
        <h3>${item.name}<br />\u3163${item.ko}</h3>
        <p>${item.category} / ${item.type}</p>
        <p>${item.option}</p>
        <div class="cart-item-bottom">
          <div class="qty-control">
            <button data-key="${item.cartKey}" data-d="-1" aria-label="${item.ko} \uC218\uB7C9 \uC904\uC774\uAE30">\u2212</button>
            <span>${item.qty}</span>
            <button data-key="${item.cartKey}" data-d="1" aria-label="${item.ko} \uC218\uB7C9 \uB298\uB9AC\uAE30">+</button>
          </div>
          <strong>${formatMoney(item.sale * item.qty)}</strong>
        </div>
      </div>
    </div>
  `;
    }
    function createEmptyCart() {
      return '<div class="cart-empty">\uC7A5\uBC14\uAD6C\uB2C8\uAC00 \uBE44\uC5B4 \uC788\uC2B5\uB2C8\uB2E4.<br />Shop\uC5D0\uC11C \uC0C1\uD488\uC744 \uC120\uD0DD\uD574\uBCF4\uC138\uC694.</div>';
    }
    function createCartSummary({
      subtotal,
      shipping,
      reward,
      pointBalance,
      pointUseLimit,
      pointUsed,
      total,
    }) {
      return `
    <div class="summary-row"><span>\uC0C1\uD488\uAE08\uC561</span><strong>${formatMoney(subtotal)}</strong></div>
    <div class="summary-row"><span>\uBC30\uC1A1\uBE44</span><strong>${shipping ? formatMoney(shipping) : "\uBB34\uB8CC"}</strong></div>
    <div class="summary-row"><span>\uBCF4\uC720 \uD3EC\uC778\uD2B8</span><strong>${formatPoints(pointBalance)}</strong></div>
    <label class="point-use-control">
      <span>\uC0AC\uC6A9 \uD3EC\uC778\uD2B8 \xB7 \uCD5C\uB300 ${formatPoints(pointUseLimit)}</span>
      <input class="quantity-input" id="cartPointUse" type="number" min="0" step="100" max="${pointUseLimit}" value="${pointUsed}" ${pointUseLimit ? "" : "disabled"} />
    </label>
    <div class="summary-row"><span>\uD3EC\uC778\uD2B8 \uC0AC\uC6A9</span><strong>${pointUsed ? `-${formatPoints(pointUsed)}` : "0P"}</strong></div>
    <div class="summary-row"><span>\uC801\uB9BD \uC608\uC815</span><strong>${formatPoints(reward)}</strong></div>
    <div class="summary-row total"><span>\uACB0\uC81C\uC608\uC815\uAE08\uC561</span><strong>${formatMoney(total)}</strong></div>
    <button class="checkout-button" id="checkoutButton">Checkout</button>
  `;
    }
    function openCheckout() {
      var _a;
      if (!requireLogin()) return;
      closeCart();
      const totals = getTotals();
      const member = getCurrentMember2();
      const defaultAddress = getDefaultShippingAddress(member);
      dom.detail.innerHTML = `
    <div class="breadcrumb">
      <button class="back-button" id="backToShop">\u2190 Back to shop</button>
      <span>Home / Checkout</span>
    </div>
    <section class="detail-layout">
      <div class="purchase-panel static-panel">
        <div class="product-category">Checkout / Order Form</div>
        <h1 class="detail-title">Payment<br />Page.</h1>
        <p class="detail-subtitle">\uC8FC\uBB38\uC790 \uC815\uBCF4, \uBC30\uC1A1\uC9C0, \uACB0\uC81C\uC218\uB2E8\uC744 \uD655\uC778\uD558\uB294 \uC0D8\uD50C \uACB0\uC81C \uD398\uC774\uC9C0\uC785\uB2C8\uB2E4.</p>
        <div class="option-box">
          <label class="option-label" for="customerName">\uC8FC\uBB38\uC790\uBA85</label>
          <input class="quantity-input" id="customerName" value="${escapeAttribute2(defaultAddress.recipient || (member == null ? void 0 : member.name) || "")}" />
          <div class="quantity-row">
            <div>
              <label class="option-label" for="customerPhone">\uC5F0\uB77D\uCC98</label>
              <input class="quantity-input" id="customerPhone" value="${escapeAttribute2(defaultAddress.phone || (member == null ? void 0 : member.phone) || "")}" />
            </div>
            <div>
              <label class="option-label" for="zipCode">\uC6B0\uD3B8\uBC88\uD638</label>
              <div class="address-input-pair">
                <input class="quantity-input" id="zipCode" value="${escapeAttribute2(defaultAddress.postcode || "")}" />
                <button class="cart-button address-search" type="button" data-checkout-address-search>\uC870\uD68C</button>
              </div>
            </div>
          </div>
          ${createCheckoutAddressLookup()}
          ${createCheckoutSavedAddresses(member)}
          <label class="option-label" for="address">\uBC30\uC1A1\uC9C0</label>
          <input class="quantity-input" id="address" value="${escapeAttribute2(defaultAddress.address || "")}" />
          <label class="option-label" for="addressDetail">\uC0C1\uC138\uC8FC\uC18C</label>
          <input class="quantity-input" id="addressDetail" value="${escapeAttribute2(defaultAddress.addressDetail || "")}" />
          <label class="option-label" for="paymentMethod">\uACB0\uC81C\uC218\uB2E8</label>
          <select class="option-select" id="paymentMethod">
            <option>\uC2E0\uC6A9\uCE74\uB4DC</option>
            <option>\uCE74\uCE74\uC624\uD398\uC774</option>
            <option>\uB124\uC774\uBC84\uD398\uC774</option>
            <option>\uBB34\uD1B5\uC7A5\uC785\uAE08</option>
          </select>
        </div>
        <div class="buy-actions">
          <button class="buy-button" id="finalPay">Pay now</button>
          <button class="cart-button" id="openCartAgain">Cart</button>
        </div>
        <p class="detail-note">
          \uC0D8\uD50C \uD654\uBA74\uC785\uB2C8\uB2E4. \uC2E4\uC81C \uC6B4\uC601 \uC2DC PG\uC0AC \uACB0\uC81C\uCC3D, \uC8FC\uBB38\uBC88\uD638 \uC0DD\uC131, \uC7AC\uACE0 \uCC28\uAC10,
          \uBC30\uC1A1\uC9C0 \uAC80\uC99D \uB85C\uC9C1\uC744 \uC5F0\uACB0\uD558\uBA74 \uB429\uB2C8\uB2E4.
        </p>
      </div>
      <aside class="purchase-panel static-panel">
        <div class="product-category">Order Summary</div>
        <div class="order-list">${state.cart.map(createCheckoutItem).join("")}</div>
        ${createCheckoutTotals(totals)}
      </aside>
    </section>
    ${createCheckoutProductDetails()}
  `;
      showDetailView();
      document.querySelector("#backToShop").addEventListener("click", showHome);
      document
        .querySelector("#openCartAgain")
        .addEventListener("click", openCart);
      document
        .querySelector("#finalPay")
        .addEventListener("click", completeCheckoutBypass);
      (_a = document.querySelector("#checkoutPointUse")) == null
        ? void 0
        : _a.addEventListener("input", (event) => {
            state.pointToUse = event.currentTarget.value;
            openCheckout();
          });
      bindCheckoutAddressEvents();
    }
    function completeCheckoutBypass() {
      if (!requireLogin()) return;
      if (!state.cart.length) {
        showToast(
          "\uC7A5\uBC14\uAD6C\uB2C8\uC5D0 \uC0C1\uD488\uC744 \uBA3C\uC800 \uB2F4\uC544\uC8FC\uC138\uC694.",
        );
        return;
      }
      const result = completeBypassPayment({
        cart: state.cart,
        store,
        payment: {
          memberId: store.currentMemberId,
          referralSourceType: "none",
          pointUsed: getTotals().pointUsed,
          shippingSnapshot: readCheckoutShippingSnapshot(),
        },
      });
      state.cart = [];
      state.pointToUse = 0;
      persistStore(store);
      updateCart();
      openPaymentResult(result);
      showToast(
        `\uACB0\uC81C \uC644\uB8CC: ${result.earnedPoints.toLocaleString("ko-KR")} \uD3EC\uC778\uD2B8\uAC00 \uC801\uB9BD\uB418\uC5C8\uC2B5\uB2C8\uB2E4.`,
      );
    }
    function createCheckoutAddressLookup() {
      return `
    <div class="address-lookup-panel checkout-address-lookup is-hidden" data-checkout-address-panel>
      <div class="address-lookup-head">
        <strong>\uBC30\uC1A1\uC9C0 \uC870\uD68C \uACB0\uACFC</strong>
        <span>\uC120\uD0DD\uD558\uBA74 \uC6B0\uD3B8\uBC88\uD638\uC640 \uAE30\uBCF8 \uC8FC\uC18C\uAC00 \uC790\uB3D9 \uC785\uB825\uB429\uB2C8\uB2E4.</span>
      </div>
      <div class="address-lookup-list">
        ${ADDRESS_LOOKUP_PRESETS.map(
          (item) => `
          <button class="address-result-button" type="button" data-checkout-address-result data-postcode="${item.postcode}" data-address="${escapeAttribute2(item.address)}">
            <strong>${item.label}</strong>
            <span>${item.postcode} ${item.address}</span>
          </button>
        `,
        ).join("")}
      </div>
    </div>
  `;
    }
    function createCheckoutSavedAddresses(member) {
      const addresses = normalizeShippingAddresses(member);
      if (!addresses.length) return "";
      return `
    <div class="checkout-saved-addresses">
      <div class="address-lookup-head">
        <strong>\uC800\uC7A5 \uBC30\uC1A1\uC9C0</strong>
        <span>\uC8FC\uBB38\uC5D0 \uC0AC\uC6A9\uD560 \uBC30\uC1A1\uC9C0\uB97C \uC120\uD0DD\uD558\uC138\uC694.</span>
      </div>
      <div class="address-lookup-list">
        ${addresses
          .map(
            (address) => `
            <button class="address-result-button" type="button" data-checkout-saved-address data-recipient="${escapeAttribute2(address.recipient)}" data-phone="${escapeAttribute2(address.phone)}" data-postcode="${escapeAttribute2(address.postcode)}" data-address="${escapeAttribute2(address.address)}" data-address-detail="${escapeAttribute2(address.addressDetail)}">
              <strong>${escapeHtml(address.label)}${address.isDefault ? " \xB7 \uAE30\uBCF8" : ""}</strong>
              <span>${escapeHtml(address.postcode)} ${escapeHtml(address.address)} ${escapeHtml(address.addressDetail)}</span>
            </button>
          `,
          )
          .join("")}
      </div>
    </div>
  `;
    }
    function bindCheckoutAddressEvents() {
      var _a;
      (_a = document.querySelector("[data-checkout-address-search]")) == null
        ? void 0
        : _a.addEventListener("click", () => {
            var _a2;
            (_a2 = document.querySelector("[data-checkout-address-panel]")) ==
            null
              ? void 0
              : _a2.classList.toggle("is-hidden");
          });
      document
        .querySelectorAll("[data-checkout-address-result]")
        .forEach((button) => {
          button.addEventListener("click", () => {
            var _a2, _b;
            setCheckoutField("#zipCode", button.dataset.postcode);
            setCheckoutField("#address", button.dataset.address);
            (_a2 = document.querySelector("[data-checkout-address-panel]")) ==
            null
              ? void 0
              : _a2.classList.add("is-hidden");
            (_b = document.querySelector("#addressDetail")) == null
              ? void 0
              : _b.focus();
          });
        });
      document
        .querySelectorAll("[data-checkout-saved-address]")
        .forEach((button) => {
          button.addEventListener("click", () => {
            setCheckoutField("#customerName", button.dataset.recipient);
            setCheckoutField("#customerPhone", button.dataset.phone);
            setCheckoutField("#zipCode", button.dataset.postcode);
            setCheckoutField("#address", button.dataset.address);
            setCheckoutField("#addressDetail", button.dataset.addressDetail);
          });
        });
    }
    function setCheckoutField(selector, value = "") {
      const field = document.querySelector(selector);
      if (field) field.value = value || "";
    }
    function readCheckoutShippingSnapshot() {
      var _a, _b, _c, _d, _e, _f;
      return {
        recipient:
          ((_a = document.querySelector("#customerName")) == null
            ? void 0
            : _a.value.trim()) || "",
        phone:
          ((_b = document.querySelector("#customerPhone")) == null
            ? void 0
            : _b.value.trim()) || "",
        postcode:
          ((_c = document.querySelector("#zipCode")) == null
            ? void 0
            : _c.value.trim()) || "",
        address:
          ((_d = document.querySelector("#address")) == null
            ? void 0
            : _d.value.trim()) || "",
        addressDetail:
          ((_e = document.querySelector("#addressDetail")) == null
            ? void 0
            : _e.value.trim()) || "",
        paymentMethod:
          ((_f = document.querySelector("#paymentMethod")) == null
            ? void 0
            : _f.value) || "",
      };
    }
    function getDefaultShippingAddress(member) {
      var _a, _b, _c;
      const address = normalizeShippingAddresses(member).find(
        (item) => item.isDefault,
      );
      if (address) return address;
      return {
        recipient: (member == null ? void 0 : member.name) || "",
        phone: (member == null ? void 0 : member.phone) || "",
        postcode:
          ((_a = member == null ? void 0 : member.address) == null
            ? void 0
            : _a.postcode) || "",
        address:
          ((_b = member == null ? void 0 : member.address) == null
            ? void 0
            : _b.address) || "",
        addressDetail:
          ((_c = member == null ? void 0 : member.address) == null
            ? void 0
            : _c.addressDetail) || "",
      };
    }
    function normalizeShippingAddresses(member) {
      const addresses = Array.isArray(
        member == null ? void 0 : member.shippingAddresses,
      )
        ? member.shippingAddresses
        : [];
      if (addresses.length) return addresses;
      if (!(member == null ? void 0 : member.address)) return [];
      return [
        {
          label: "\uAE30\uBCF8 \uBC30\uC1A1\uC9C0",
          recipient: member.name || "",
          phone: member.phone || "",
          postcode: member.address.postcode || "",
          address: member.address.address || "",
          addressDetail: member.address.addressDetail || "",
          isDefault: true,
        },
      ].filter((address) => address.postcode || address.address);
    }
    function openPaymentResult(result) {
      var _a;
      dom.detail.innerHTML = `
    <div class="breadcrumb">
      <button class="back-button" id="backToShop">\u2190 Back to shop</button>
      <span>Home / Checkout / Complete</span>
    </div>
    <section class="payment-result" id="paymentResult">
      <div class="management-head">
        <div>
          <div class="product-category">Payment bypass / Paid</div>
          <h1 class="detail-title">Order<br />Complete.</h1>
        </div>
        <p>
          PG \uACB0\uC81C\uCC3D\uC740 \uC6B0\uD68C \uCC98\uB9AC\uD588\uACE0, \uC8FC\uBB38 \uAE08\uC561\uACFC \uD3EC\uC778\uD2B8 \uC801\uB9BD \uB0B4\uC5ED\uC744 \uC800\uC7A5\uD588\uC2B5\uB2C8\uB2E4.
        </p>
      </div>
      <div class="management-grid">
        <article><span>\uC8FC\uBB38\uBC88\uD638</span><strong>${result.order.id}</strong></article>
        <article><span>\uC2E4\uACB0\uC81C \uC0C1\uD488\uAE08\uC561</span><strong>${formatMoney(result.totals.paidProductAmount)}</strong></article>
        <article><span>\uBC30\uC1A1\uBE44</span><strong>${result.totals.shippingAmount ? formatMoney(result.totals.shippingAmount) : "\uBB34\uB8CC"}</strong></article>
        <article><span>\uD3EC\uC778\uD2B8 \uC0AC\uC6A9</span><strong>${result.totals.pointUsed ? `-${result.totals.pointUsed.toLocaleString("ko-KR")}P` : "0P"}</strong></article>
        <article><span>\uC801\uB9BD \uD3EC\uC778\uD2B8</span><strong>${result.earnedPoints.toLocaleString("ko-KR")}P</strong></article>
        <article><span>\uCD94\uCC9C \uB9C1\uD06C \uC0DD\uC131</span><strong>${result.referralLinks.length}\uAC1C</strong></article>
        <article><span>\uCC98\uB9AC \uC0C1\uD0DC</span><strong>\uC644\uB8CC</strong></article>
      </div>
      <div class="payment-process">
        <div><strong>01 \uC8FC\uBB38 \uC0DD\uC131</strong><span>${result.order.id} \uC8FC\uBB38\uC744 paid \uC0C1\uD0DC\uB85C \uC800\uC7A5\uD588\uC2B5\uB2C8\uB2E4.</span></div>
        <div><strong>02 \uD3EC\uC778\uD2B8 \uC801\uB9BD</strong><span>${result.order.paidProductAmount.toLocaleString("ko-KR")}\uC6D0 \xD7 ${store.settings.purchasePointRate}% = ${result.earnedPoints.toLocaleString("ko-KR")}P</span></div>
        <div><strong>03 \uAC1C\uC778 \uCD94\uCC9C\uB9C1\uD06C</strong><span>\uAD6C\uB9E4 \uC0C1\uD488 \uC885\uB958 \uAE30\uC900\uC73C\uB85C ${result.referralLinks.length}\uAC1C \uB9C1\uD06C\uB97C \uC0DD\uC131\uD588\uC2B5\uB2C8\uB2E4.</span></div>
      </div>
      ${createReferralCopyPanel(result.referralLinks)}
      <div class="buy-actions result-actions">
        <button class="buy-button" type="button" id="resultBackToShop">Shop \uACC4\uC18D \uBCF4\uAE30</button>
      </div>
    </section>
  `;
      showDetailView();
      document.querySelector("#backToShop").addEventListener("click", showHome);
      (_a = document.querySelector("#resultBackToShop")) == null
        ? void 0
        : _a.addEventListener("click", showHome);
      bindReferralCopyButtons();
    }
    function createReferralCopyPanel(links) {
      if (!links.length) return "";
      return `
    <section class="referral-copy-panel">
      <div class="product-category">Personal referral links</div>
      <div class="profile-list">
        ${links
          .map(
            (link) => `
            <article class="profile-row referral-row">
              <div><strong>${link.code}</strong><span>${link.productId}</span></div>
              <div>
                <span>${createReferralUrl(link.code)}</span>
                <button class="cart-button mini-button" type="button" data-copy-referral="${createReferralUrl(link.code)}">\uB9C1\uD06C \uBCF5\uC0AC</button>
              </div>
            </article>
          `,
          )
          .join("")}
      </div>
    </section>
  `;
    }
    function bindReferralCopyButtons() {
      document.querySelectorAll("[data-copy-referral]").forEach((button) => {
        button.addEventListener("click", async () => {
          await copyText(button.dataset.copyReferral);
          showToast(
            "\uCD94\uCC9C \uB9C1\uD06C\uAC00 \uBCF5\uC0AC\uB418\uC5C8\uC2B5\uB2C8\uB2E4.",
          );
        });
      });
    }
    async function copyText(text) {
      var _a;
      if ((_a = navigator.clipboard) == null ? void 0 : _a.writeText) {
        await navigator.clipboard.writeText(text);
        return;
      }
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";
      document.body.append(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
    }
    function createReferralUrl(code) {
      return `${window.location.origin}${window.location.pathname}?ref=${encodeURIComponent(code)}`;
    }
    function createCheckoutProductDetails() {
      const uniqueItems = state.cart.filter(
        (item, index, items) =>
          items.findIndex((candidate) => candidate.id === item.id) === index,
      );
      if (!uniqueItems.length) return "";
      return `
    <section class="checkout-detail-section">
      <div class="management-head compact">
        <div>
          <div class="product-category">Product detail guide</div>
          <h2>\uC0C1\uC138 \uC548\uB0B4</h2>
        </div>
        <p>\uACB0\uC81C \uC804 \uC0C1\uD488\uBCC4 \uC0C1\uC138 \uC774\uBBF8\uC9C0, \uC635\uC158, \uC0AC\uC6A9 \uC548\uB0B4\uB97C \uD655\uC778\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.</p>
      </div>
      ${uniqueItems.map(createCheckoutProductDetail).join("")}
    </section>
  `;
    }
    function createCheckoutProductDetail(item) {
      const product = getProduct(item.id) || item;
      const detailImages = getProductDetailImages(product);
      const sectionId =
        product.id === "device-led" ? ' id="checkoutLedDetail"' : "";
      return `
    <article class="checkout-product-detail"${sectionId}>
      <div class="checkout-detail-media-grid">
        ${detailImages
          .map(
            (image, index) => `
            <figure class="${index === 0 ? "is-main" : ""}">
              <img src="${image}" alt="${product.ko} \uC0C1\uC138 \uC774\uBBF8\uC9C0 ${index + 1}" />
            </figure>
          `,
          )
          .join("")}
      </div>
      <div class="checkout-detail-copy">
        <div class="product-category">${product.category} / ${product.type}</div>
        <h2>${product.name}</h2>
        <p>
          ${product.desc || product.short || "\uC0C1\uD488 \uC0C1\uC138 \uC548\uB0B4\uB97C \uD655\uC778\uD558\uACE0 \uAD6C\uB9E4\uB97C \uC9C4\uD589\uD558\uC138\uC694."}
        </p>
        <div class="checkout-detail-grid">
          <div>
            <strong>\uAD6C\uB9E4 \uC218\uB7C9</strong>
            <span>${item.qty}\uAC1C</span>
          </div>
          <div>
            <strong>\uC0C1\uD488 \uAE08\uC561</strong>
            <span>${formatMoney(product.sale * item.qty)}</span>
          </div>
          <div>
            <strong>\uC635\uC158</strong>
            <span>${product.option}</span>
          </div>
          <div>
            <strong>\uBC30\uC1A1</strong>
            <span>${product.shippingFee ? `${formatMoney(product.shippingFee)} / 5\uB9CC\uC6D0 \uC774\uC0C1 \uBB34\uB8CC` : "\uBB34\uB8CC \uBC30\uC1A1"}</span>
          </div>
        </div>
        <div class="checkout-care-list">
          ${createCheckoutGuideItems(product).join("")}
        </div>
      </div>
    </article>
  `;
    }
    function getProductDetailImages(product) {
      const images = Array.isArray(product.detailImages)
        ? product.detailImages.filter(Boolean)
        : [];
      return (images.length ? images : [product.image])
        .filter(Boolean)
        .slice(0, 5);
    }
    function createCheckoutGuideItems(product) {
      const copy =
        categoryCopy[product.category] || categoryCopy["\uD654\uC7A5\uD488"];
      return [
        `<div><strong>01</strong> ${copy.usage}</div>`,
        `<div><strong>02</strong> ${copy.material}</div>`,
        `<div><strong>03</strong> ${product.short || copy.benefits[0]}</div>`,
      ];
    }
    function createCheckoutItem(item) {
      return `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.ko}" />
      <div>
        <h3>${item.name}<br />\u3163${item.ko}</h3>
        <p>${item.category} / ${item.type}</p>
        <p>\uC218\uB7C9 ${item.qty}</p>
        <div class="cart-item-bottom">
          <span>${item.option}</span>
          <strong>${formatMoney(item.sale * item.qty)}</strong>
        </div>
      </div>
    </div>
  `;
    }
    function createCheckoutTotals({
      subtotal,
      shipping,
      reward,
      pointBalance,
      pointUseLimit,
      pointUsed,
      total,
    }) {
      return `
    <div class="detail-price-box">
      <div class="detail-price-item"><span>\uC0C1\uD488\uAE08\uC561</span><strong>${formatMoney(subtotal)}</strong></div>
      <div class="detail-price-item"><span>\uBC30\uC1A1\uBE44</span><strong>${shipping ? formatMoney(shipping) : "\uBB34\uB8CC"}</strong></div>
      <div class="detail-price-item"><span>\uBCF4\uC720 \uD3EC\uC778\uD2B8</span><strong>${formatPoints(pointBalance)}</strong></div>
      <div class="detail-price-item"><span>\uC0AC\uC6A9 \uAC00\uB2A5</span><strong>${formatPoints(pointUseLimit)}</strong></div>
      <div class="detail-price-item point-input-item">
        <span>\uD3EC\uC778\uD2B8 \uC0AC\uC6A9</span>
        <input class="quantity-input" id="checkoutPointUse" type="number" min="0" step="100" max="${pointUseLimit}" value="${pointUsed}" ${pointUseLimit ? "" : "disabled"} />
      </div>
      <div class="detail-price-item"><span>\uC801\uB9BD \uC608\uC815</span><strong>${formatPoints(reward)}</strong></div>
      <div class="detail-price-item"><span>\uACB0\uC81C\uC608\uC815\uAE08\uC561</span><strong>${formatMoney(total)}</strong></div>
    </div>
  `;
    }
    function showHome() {
      var _a;
      dom.detail.classList.add("is-hidden");
      dom.auth.classList.add("is-hidden");
      (_a = dom.management) == null ? void 0 : _a.classList.add("is-hidden");
      dom.home.classList.remove("is-hidden");
      renderProducts(state.activeCategory);
      setTimeout(
        () =>
          document
            .querySelector("#shop")
            .scrollIntoView({ behavior: "smooth" }),
        0,
      );
    }
    function showDetailView() {
      var _a;
      dom.home.classList.add("is-hidden");
      dom.auth.classList.add("is-hidden");
      (_a = dom.management) == null ? void 0 : _a.classList.add("is-hidden");
      dom.detail.classList.remove("is-hidden");
      scrollTo({ top: 0, behavior: "smooth" });
    }
    function openCart() {
      updateCart();
      document.body.classList.add("cart-open");
    }
    function closeCart() {
      document.body.classList.remove("cart-open");
    }
    function showToast(message) {
      dom.toast.textContent = message;
      dom.toast.classList.add("is-open");
      setTimeout(() => dom.toast.classList.remove("is-open"), 2300);
    }
    function bindShopEvents() {
      document.querySelectorAll(".category-btn").forEach((button) => {
        button.addEventListener("click", () =>
          renderProducts(button.dataset.category),
        );
      });
      dom.grid.addEventListener("click", (event) => {
        const card = event.target.closest(".product-card");
        if (card) openDetail(getProduct(card.dataset.id));
      });
      dom.grid.addEventListener("keydown", (event) => {
        const card = event.target.closest(".product-card");
        if (!card || (event.key !== "Enter" && event.key !== " ")) return;
        event.preventDefault();
        openDetail(getProduct(card.dataset.id));
      });
      dom.cartList.addEventListener("click", (event) => {
        const button = event.target.closest("button[data-key]");
        if (!button) return;
        const item = state.cart.find(
          (cartItem) => cartItem.cartKey === button.dataset.key,
        );
        if (!item) return;
        const product = getProduct(item.id);
        const variant = (
          (product == null ? void 0 : product.variants) || []
        ).find((variantItem) => variantItem.sku === item.variantSku);
        const nextQuantity = item.qty + Number(button.dataset.d);
        if (
          nextQuantity > getPurchasableStock(product || item, variant || item)
        ) {
          showToast(
            "\uC120\uD0DD \uC635\uC158 \uC7AC\uACE0\uB97C \uCD08\uACFC\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.",
          );
          return;
        }
        item.qty = nextQuantity;
        state.cart = state.cart.filter((cartItem) => cartItem.qty > 0);
        if (!state.cart.length) state.pointToUse = 0;
        updateCart();
      });
      dom.cartSummary.addEventListener("input", (event) => {
        var _a;
        if (((_a = event.target) == null ? void 0 : _a.id) !== "cartPointUse")
          return;
        state.pointToUse = event.target.value;
        updateCart();
      });
      dom.bag.addEventListener("click", openCart);
      document
        .querySelector("#cartOverlay")
        .addEventListener("click", closeCart);
      document.querySelector("#cartClose").addEventListener("click", closeCart);
      document.querySelector("#logoHome").addEventListener("click", () => {
        dom.detail.classList.add("is-hidden");
        dom.auth.classList.add("is-hidden");
        dom.home.classList.remove("is-hidden");
        renderProducts(state.activeCategory);
        scrollTo({ top: 0, behavior: "smooth" });
      });
      document.querySelectorAll("[data-home-link]").forEach((link) => {
        link.addEventListener("click", () => {
          dom.detail.classList.add("is-hidden");
          dom.auth.classList.add("is-hidden");
          dom.home.classList.remove("is-hidden");
          renderProducts(state.activeCategory);
        });
      });
      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") closeCart();
      });
    }
    function validateCatalog() {
      const productList = store.products || [];
      const categorySet = new Set(
        productList.map((product) => product.category),
      );
      const hasRequiredCategories = CATEGORIES.every((category) =>
        categorySet.has(category),
      );
      if (productList.length < 10 || !hasRequiredCategories) {
        console.warn(
          "\uC0C1\uD488 \uB370\uC774\uD130\uB294 \uCD5C\uC18C 10\uAC1C\uC640 \uC9C0\uC815\uB41C 3\uAC1C \uCE74\uD14C\uACE0\uB9AC\uB97C \uC720\uC9C0\uD574\uC57C \uD569\uB2C8\uB2E4.",
        );
      }
    }
    function escapeHtml(value) {
      return String(value || "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
    }
    function escapeAttribute2(value) {
      return escapeHtml(value);
    }
    return {
      state,
      renderProducts,
      openDetail,
      addToCart,
      updateCart,
      openCart,
      closeCart,
      openCheckout,
      completeCheckoutBypass,
      showHome,
      showToast,
      bindShopEvents,
      validateCatalog,
    };
  }

  // scripts/app.js
  var appReady = initializeApp();
  window.__beautyAppReady = appReady;
  async function initializeApp() {
    const dom = {
      grid: document.querySelector("#productGrid"),
      home: document.querySelector("#homeView"),
      detail: document.querySelector("#detailView"),
      auth: document.querySelector("#authView"),
      management: document.querySelector("#managementView"),
      count: document.querySelector("#categoryCount"),
      bag: document.querySelector("#bagButton"),
      cartList: document.querySelector("#cartList"),
      cartSummary: document.querySelector("#cartSummary"),
      toast: document.querySelector("#toast"),
      loginLink: document.querySelector("#loginLink"),
      sessionUser: document.querySelector("#sessionUser"),
      logoutButton: document.querySelector("#logoutButton"),
    };
    const store = await loadStore();
    await saveStore(store);
    const getCurrentMember2 = () =>
      store.members.find((member) => member.id === store.currentMemberId);
    let shop;
    let auth;
    let activeManagementRole = "";
    function updateSessionUi() {
      const member = getCurrentMember2();
      dom.loginLink.classList.toggle("is-hidden", Boolean(member));
      dom.sessionUser.classList.toggle("is-hidden", !member);
      dom.logoutButton.classList.toggle("is-hidden", !member);
      dom.sessionUser.textContent = member ? `${member.name}\uB2D8` : "";
    }
    function requireLogin() {
      const member = getCurrentMember2();
      if ((member == null ? void 0 : member.status) === "active") return true;
      if (member) {
        store.currentMemberId = "";
        saveStore(store);
        updateSessionUi();
        shop.showToast(
          "\uAD6C\uB9E4 \uAC00\uB2A5\uD55C \uD68C\uC6D0 \uC0C1\uD0DC\uAC00 \uC544\uB2D9\uB2C8\uB2E4. \uB2E4\uC2DC \uB85C\uADF8\uC778\uD574\uC8FC\uC138\uC694.",
        );
        auth.openAuth("login");
        return false;
      }
      shop.showToast(
        "\uB85C\uADF8\uC778 \uD6C4 \uAD6C\uB9E4\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.",
      );
      auth.openAuth("login");
      return false;
    }
    shop = createShopController({
      dom,
      store,
      persistStore: saveStore,
      requireLogin,
    });
    auth = createAuthController({
      dom,
      store,
      persistStore: saveStore,
      updateSessionUi,
      showHome: shop.showHome,
      closeCart: shop.closeCart,
      showToast: shop.showToast,
    });
    const management = createManagementController({
      dom,
      store,
      closeCart: shop.closeCart,
      persistStore: saveStore,
    });
    shop.validateCatalog();
    shop.bindShopEvents();
    shop.renderProducts();
    shop.updateCart();
    dom.loginLink.addEventListener("click", (event) => {
      event.preventDefault();
      auth.openAuth("login");
    });
    dom.sessionUser.addEventListener("click", () => {
      auth.openProfile();
    });
    dom.logoutButton.addEventListener("click", () => {
      store.currentMemberId = "";
      saveStore(store);
      updateSessionUi();
      auth.closeAuth();
      activeManagementRole = "";
      shop.showHome();
      dom.management.classList.add("is-hidden");
      dom.detail.classList.add("is-hidden");
      dom.home.classList.remove("is-hidden");
      window.location.hash = "";
      shop.showToast("\uB85C\uADF8\uC544\uC6C3\uB418\uC5C8\uC2B5\uB2C8\uB2E4.");
    });
    document.addEventListener("click", (event) => {
      const agencyJoinLink = event.target.closest("[data-agency-join-link]");
      if (agencyJoinLink) {
        event.preventDefault();
        store.pendingAgencySlug = agencyJoinLink.dataset.agencyJoinLink;
        saveStore(store);
        auth.openAuth("signup");
        return;
      }
      const link = event.target.closest("[data-management-link]");
      if (!link) return;
      event.preventDefault();
      const role = link.dataset.managementLink;
      if (role === "admin" || role === "agency") {
        auth.openManagementLogin(role, (managementRole) => {
          activeManagementRole = managementRole;
          management.openManagement(managementRole);
        });
        return;
      }
      auth.closeAuth();
      activeManagementRole = role;
      management.openManagement(role);
    });
    initializeAgencyJoinContext();
    updateSessionUi();
    function initializeAgencyJoinContext() {
      var _a;
      const params = new URLSearchParams(window.location.search);
      const agencySlug =
        params.get("agency") ||
        ((_a = window.location.hash.match(/^#join\/(.+)$/)) == null
          ? void 0
          : _a[1]);
      if (!agencySlug) return;
      store.pendingAgencySlug = decodeURIComponent(agencySlug);
      saveStore(store);
      auth.openAuth("signup");
    }
  }
})();
