import { reactive } from 'vue'

export function useAnimations() {
  // Predefined animation variants
  const variants = reactive({
    // Fade animations
    fadeIn: {
      initial: { opacity: 0 },
      enter: { 
        opacity: 1,
        transition: {
          duration: 300,
          ease: 'easeOut'
        }
      }
    },

    fadeInUp: {
      initial: { 
        opacity: 0,
        y: 20
      },
      enter: { 
        opacity: 1,
        y: 0,
        transition: {
          duration: 400,
          ease: 'easeOut'
        }
      }
    },

    fadeInDown: {
      initial: { 
        opacity: 0,
        y: -20
      },
      enter: { 
        opacity: 1,
        y: 0,
        transition: {
          duration: 400,
          ease: 'easeOut'
        }
      }
    },

    // Scale animations
    scaleIn: {
      initial: { 
        opacity: 0,
        scale: 0.8
      },
      enter: { 
        opacity: 1,
        scale: 1,
        transition: {
          duration: 300,
          ease: 'easeOut'
        }
      }
    },

    scaleInUp: {
      initial: { 
        opacity: 0,
        scale: 0.8,
        y: 20
      },
      enter: { 
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
          duration: 400,
          ease: 'easeOut'
        }
      }
    },

    // Slide animations
    slideInLeft: {
      initial: { 
        opacity: 0,
        x: -50
      },
      enter: { 
        opacity: 1,
        x: 0,
        transition: {
          duration: 400,
          ease: 'easeOut'
        }
      }
    },

    slideInRight: {
      initial: { 
        opacity: 0,
        x: 50
      },
      enter: { 
        opacity: 1,
        x: 0,
        transition: {
          duration: 400,
          ease: 'easeOut'
        }
      }
    },

    // Bounce animation
    bounceIn: {
      initial: { 
        opacity: 0,
        scale: 0.3
      },
      enter: { 
        opacity: 1,
        scale: 1,
        transition: {
          duration: 600,
          ease: [0.68, -0.55, 0.265, 1.55] // Custom bounce ease
        }
      }
    },

    // Rotate animation
    rotateIn: {
      initial: { 
        opacity: 0,
        rotate: -90,
        scale: 0.8
      },
      enter: { 
        opacity: 1,
        rotate: 0,
        scale: 1,
        transition: {
          duration: 500,
          ease: 'easeOut'
        }
      }
    },

    // Hover animations
    hoverLift: {
      initial: { y: 0 },
      hover: { 
        y: -2,
        transition: {
          duration: 200,
          ease: 'easeOut'
        }
      }
    },

    hoverScale: {
      initial: { scale: 1 },
      hover: { 
        scale: 1.05,
        transition: {
          duration: 200,
          ease: 'easeOut'
        }
      }
    },

    // Button press animation
    buttonPress: {
      initial: { scale: 1 },
      tap: { 
        scale: 0.95,
        transition: {
          duration: 100,
          ease: 'easeInOut'
        }
      }
    },

    // Stagger animations for lists
    staggerContainer: {
      initial: {},
      enter: {
        transition: {
          staggerChildren: 0.1,
          delayChildren: 0.1
        }
      }
    },

    staggerItem: {
      initial: { 
        opacity: 0,
        y: 20
      },
      enter: { 
        opacity: 1,
        y: 0,
        transition: {
          duration: 400,
          ease: 'easeOut'
        }
      }
    },

    // Loading animations
    pulse: {
      initial: { scale: 1 },
      animate: {
        scale: [1, 1.05, 1],
        transition: {
          duration: 1000,
          repeat: Infinity,
          ease: 'easeInOut'
        }
      }
    },

    spin: {
      initial: { rotate: 0 },
      animate: {
        rotate: 360,
        transition: {
          duration: 1000,
          repeat: Infinity,
          ease: 'linear'
        }
      }
    },

    // Page transitions
    pageSlideLeft: {
      initial: { 
        opacity: 0,
        x: 100
      },
      enter: { 
        opacity: 1,
        x: 0,
        transition: {
          duration: 500,
          ease: 'easeOut'
        }
      },
      leave: { 
        opacity: 0,
        x: -100,
        transition: {
          duration: 300,
          ease: 'easeIn'
        }
      }
    },

    // Modal animations
    modalBackdrop: {
      initial: { opacity: 0 },
      enter: { 
        opacity: 1,
        transition: {
          duration: 300,
          ease: 'easeOut'
        }
      },
      leave: { 
        opacity: 0,
        transition: {
          duration: 200,
          ease: 'easeIn'
        }
      }
    },

    modalPanel: {
      initial: { 
        opacity: 0,
        scale: 0.8,
        y: 20
      },
      enter: { 
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
          duration: 300,
          ease: 'easeOut'
        }
      },
      leave: { 
        opacity: 0,
        scale: 0.8,
        y: 20,
        transition: {
          duration: 200,
          ease: 'easeIn'
        }
      }
    }
  })

  // Helper function to get variant with custom options
  const getVariant = (name: keyof typeof variants, options: any = {}) => {
    const variant = variants[name]
    if (!variant) return {}

    // Merge custom options with default variant
    return {
      ...variant,
      ...options
    }
  }

  // Helper function to create stagger delay
  const createStaggerDelay = (index: number, baseDelay: number = 100) => {
    return index * baseDelay
  }

  // Helper function for conditional animations based on reduced motion preference
  const respectsReducedMotion = () => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }

  const getResponsiveVariant = (variantName: keyof typeof variants) => {
    if (respectsReducedMotion()) {
      // Return simplified animation for reduced motion
      return {
        initial: { opacity: 0 },
        enter: { 
          opacity: 1,
          transition: { duration: 200 }
        }
      }
    }
    return variants[variantName]
  }

  return {
    variants,
    getVariant,
    createStaggerDelay,
    respectsReducedMotion,
    getResponsiveVariant
  }
}