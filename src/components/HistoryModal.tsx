import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { HistoryItem } from '@/types/calculator';
import { AppTheme } from '@/constants/theme';
import { formatNumberWithCommas } from '@/utils/calculatorLogic';

interface HistoryModalProps {
  visible: boolean;
  history: HistoryItem[];
  theme: AppTheme;
  onClose: () => void;
  onSelectHistory: (item: HistoryItem) => void;
  onClearHistory: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  visible,
  history,
  theme,
  onClose,
  onSelectHistory,
  onClearHistory,
}) => {
  const formatTime = (ts: number) => {
    const date = new Date(ts);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <SafeAreaView style={[styles.container, { backgroundColor: theme.surface }]}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: theme.border }]}>
            <Text style={[styles.title, { color: theme.textPrimary }]}>Calculation History</Text>
            
            <View style={styles.headerButtons}>
              {history.length > 0 && (
                <Pressable
                  onPress={onClearHistory}
                  style={({ pressed }) => [
                    styles.headerActionBtn,
                    { opacity: pressed ? 0.7 : 1 },
                  ]}
                >
                  <Text style={[styles.clearBtnText, { color: theme.btnOperator }]}>Clear</Text>
                </Pressable>
              )}
              
              <Pressable
                onPress={onClose}
                style={({ pressed }) => [
                  styles.closeBtn,
                  { backgroundColor: pressed ? theme.btnFunctionActive : theme.btnFunction },
                ]}
              >
                <Text style={[styles.closeBtnText, { color: theme.textPrimary }]}>✕</Text>
              </Pressable>
            </View>
          </View>

          {/* History List */}
          {history.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyEmoji}>📜</Text>
              <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>
                No History Yet
              </Text>
              <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
                Your completed calculations will appear here.
              </Text>
            </View>
          ) : (
            <FlatList
              data={history}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContent}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    onSelectHistory(item);
                    onClose();
                  }}
                  style={({ pressed }) => [
                    styles.historyItem,
                    {
                      backgroundColor: pressed ? theme.btnFunctionActive : theme.card,
                      borderColor: theme.border,
                    },
                  ]}
                >
                  <View style={styles.itemMeta}>
                    <Text style={[styles.timeText, { color: theme.textDim }]}>
                      {formatTime(item.timestamp)}
                    </Text>
                  </View>
                  <Text style={[styles.exprText, { color: theme.textSecondary }]}>
                    {item.expression} =
                  </Text>
                  <Text style={[styles.resultText, { color: theme.textPrimary }]}>
                    {formatNumberWithCommas(item.result)}
                  </Text>
                </Pressable>
              )}
            />
          )}
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'flex-end',
  },
  container: {
    height: '75%',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerActionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  clearBtnText: {
    fontSize: 16,
    fontWeight: '600',
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContent: {
    paddingVertical: 14,
    gap: 12,
  },
  historyItem: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  itemMeta: {
    marginBottom: 4,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  exprText: {
    fontSize: 16,
    marginBottom: 4,
  },
  resultText: {
    fontSize: 24,
    fontWeight: '700',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
});

