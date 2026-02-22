import { ActivityIndicator, View, StyleSheet } from 'react-native'
import type { Colors } from '../../common/theme'
import { useTheme } from '../../common/theme/context'

export const LoadingView = () => {
  const { colors } = useTheme()
  const styles = createStyles(colors)

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  )
}

const createStyles = (colors: Colors) =>
  StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  })
