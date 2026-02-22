import { ActivityIndicator, View, StyleSheet } from 'react-native'
import { colors } from '../../common/theme'

export const LoadingView = () => (
  <View style={styles.container}>
    <ActivityIndicator size="large" color={colors.primary} />
  </View>
)

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
})
